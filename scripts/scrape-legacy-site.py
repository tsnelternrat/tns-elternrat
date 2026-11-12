#!/usr/bin/env python3
"""Scrape https://tsn-elternrat.ch (WordPress) via its public REST API.

Usage:  python3 scripts/scrape-legacy-site.py [output_dir]   (default: legacy-site)

Output layout:
  raw/            unmodified REST JSON (pages, posts, media, categories) + sitemap URLs
  raw/html/       fully rendered HTML of every page/post (theme included)
  pages/, posts/  one .md (with frontmatter) and one .html (content only) per entry
  media/          original uploads, same sub-paths as wp-content/uploads
  media.json      media metadata incl. local path and where each file is used
  INDEX.md        overview for deciding what to keep
"""
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path

BASE = "https://tsn-elternrat.ch"
UA = "Mozilla/5.0 (compatible; site-migration-fetch)"
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "legacy-site").resolve()


def fetch(url, retries=3):
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            if e.code in (400, 401, 403, 404):
                return e.code, e.headers, e.read()
            last = e
        except Exception as e:  # noqa: BLE001
            last = e
        time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"failed: {url}: {last}")


def rest_all(rest_base):
    items, page = [], 1
    while True:
        st, headers, body = fetch(f"{BASE}/wp-json/wp/v2/{rest_base}?per_page=100&page={page}")
        if st != 200:
            print(f"  ! {rest_base} page {page}: HTTP {st}")
            break
        items.extend(json.loads(body))
        if page >= int(headers.get("X-WP-TotalPages") or 1):
            break
        page += 1
    return items


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------------------------------------------------------------- HTML -> Markdown
class MD(HTMLParser):
    SKIP = {"script", "style", "noscript", "svg", "form", "template"}
    BLOCK = {"p", "div", "section", "article", "figure", "figcaption", "header", "footer", "tr", "table"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.lists, self.href = [], 0, [], []
        self.images, self.links = [], []

    def nl(self, n=2):
        text = "".join(self.out).rstrip(" ")
        have = len(text) - len(text.rstrip("\n"))
        self.out = [text + "\n" * max(0, n - have)] if text else []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self.SKIP:
            self.skip += 1
            return
        if self.skip:
            return
        if re.fullmatch(r"h[1-6]", tag):
            self.nl()
            self.out.append("#" * int(tag[1]) + " ")
        elif tag in self.BLOCK or tag == "blockquote":
            self.nl()
            if tag == "blockquote":
                self.out.append("> ")
        elif tag == "br":
            self.out.append("  \n")
        elif tag == "hr":
            self.nl()
            self.out.append("---")
            self.nl()
        elif tag in ("strong", "b"):
            self.out.append("**")
        elif tag in ("em", "i"):
            self.out.append("*")
        elif tag in ("ul", "ol"):
            self.nl(1 if self.lists else 2)
            self.lists.append([tag, 0])
        elif tag == "li":
            self.nl(1)
            depth = max(0, len(self.lists) - 1)
            if self.lists and self.lists[-1][0] == "ol":
                self.lists[-1][1] += 1
                self.out.append("  " * depth + f"{self.lists[-1][1]}. ")
            else:
                self.out.append("  " * depth + "- ")
        elif tag in ("td", "th"):
            self.out.append("| ")
        elif tag == "a":
            self.href.append(a.get("href") or "")
            self.out.append("[")
        elif tag == "img":
            src = a.get("src") or a.get("data-src") or ""
            if src:
                self.images.append(src)
                self.nl()
                self.out.append(f"![{a.get('alt') or ''}]({src})")
                self.nl()
        elif tag in ("iframe", "video", "audio", "source", "embed"):
            src = a.get("src") or ""
            if src:
                self.nl()
                self.out.append(f"[embed: {tag}]({src})")
                self.nl()

    def handle_endtag(self, tag):
        if tag in self.SKIP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if re.fullmatch(r"h[1-6]", tag) or tag in self.BLOCK or tag == "blockquote":
            self.nl(1 if tag == "tr" else 2)
        elif tag in ("strong", "b"):
            self.out.append("**")
        elif tag in ("em", "i"):
            self.out.append("*")
        elif tag in ("ul", "ol"):
            if self.lists:
                self.lists.pop()
            self.nl(1 if self.lists else 2)
        elif tag in ("td", "th"):
            self.out.append(" ")
        elif tag == "a" and self.href:
            href = self.href.pop()
            self.links.append(href)
            self.out.append(f"]({href})")

    def handle_data(self, data):
        if not self.skip:
            self.out.append(re.sub(r"\s+", " ", data))


def to_markdown(fragment):
    p = MD()
    p.feed(fragment or "")
    text = "".join(p.out)
    text = re.sub(r"[ \t]+\n", lambda m: m.group(0) if m.group(0) == "  \n" else "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    text = text.replace("****", "").replace("[]()", "")
    return text + "\n", p.images, p.links


def plain(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def rel_path(link):
    path = urllib.parse.urlparse(link).path.strip("/")
    parts = [re.sub(r"[^A-Za-z0-9._-]", "_", urllib.parse.unquote(x)) for x in path.split("/") if x not in ("", ".", "..")]
    return "/".join(parts) or "home"


UPLOADS = re.compile(r"https?://(?:www\.)?tsn-elternrat\.ch/wp-content/uploads/([^\s\"'<>)\\]+)")


def upload_key(path):
    """Normalise an uploads path: strip WP size suffix (-300x200) and -scaled."""
    path = urllib.parse.unquote(path.split("?")[0])
    return re.sub(r"(-\d+x\d+|-scaled)+(\.[A-Za-z0-9]+)$", r"\2", path).lower()


def frontmatter(d):
    lines = ["---"]
    for k, v in d.items():
        lines.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
    return "\n".join(lines) + "\n---\n\n"


# ---------------------------------------------------------------- main
def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print("-> REST collections")
    data = {}
    for rb in ("pages", "posts", "media", "categories"):
        data[rb] = rest_all(rb)
        write_json(OUT / "raw" / f"{rb}.json", data[rb])
        print(f"   {rb}: {len(data[rb])}")

    st, _, body = fetch(f"{BASE}/wp-json/")
    if st == 200:
        root = json.loads(body)
        write_json(OUT / "raw" / "site.json", {k: root.get(k) for k in ("name", "description", "url", "home", "gmt_offset", "timezone_string", "namespaces", "site_logo", "site_icon", "site_icon_url")})

    # sitemap URLs (to spot anything the REST API does not list)
    print("-> sitemaps")
    sitemap_urls, queue, seen = set(), [f"{BASE}/wp-sitemap.xml", f"{BASE}/sitemap.xml"], set()
    while queue:
        u = queue.pop()
        if u in seen:
            continue
        seen.add(u)
        st, _, body = fetch(u)
        if st != 200:
            continue
        for loc in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body.decode("utf-8", "replace")):
            loc = html.unescape(loc)
            (queue if loc.endswith(".xml") else sitemap_urls).add(loc) if not loc.endswith(".xml") else queue.append(loc)
    write_json(OUT / "raw" / "sitemap-urls.json", sorted(sitemap_urls))

    by_id = {e["id"]: e for e in data["pages"] + data["posts"]}
    entries, usage = [], {}

    print("-> pages & posts")
    for kind in ("pages", "posts"):
        for e in data[kind]:
            rel = rel_path(e["link"])
            content = e.get("content", {}).get("rendered", "")
            md, images, links = to_markdown(content)
            title = plain(e.get("title", {}).get("rendered"))
            parent = by_id.get(e.get("parent") or 0)
            meta = {
                "title": title,
                "wp_id": e["id"],
                "type": e["type"],
                "slug": e["slug"],
                "url": e["link"],
                "parent": plain(parent["title"]["rendered"]) if parent else None,
                "menu_order": e.get("menu_order"),
                "date": e.get("date"),
                "modified": e.get("modified"),
                "template": e.get("template") or None,
                "featured_media": e.get("featured_media") or None,
                "excerpt": plain(e.get("excerpt", {}).get("rendered")) or None,
            }
            # full rendered page, theme included
            st, _, body = fetch(e["link"])
            full = body.decode("utf-8", "replace") if st == 200 else ""

            # some pages (e.g. the blogroll "Links") are filled by the theme, not by post content
            if not re.search(r"\w", re.sub(r"!?\[[^\]]*\]\([^)]*\)", "", md)):
                art = re.search(r"<article\b.*?</article>", full, flags=re.S | re.I) or re.search(r"<main\b.*?</main>", full, flags=re.S | re.I)
                if art:
                    content = art.group(0)
                    md, images, links = to_markdown(content)
                    meta["content_source"] = "rendered-page"
            meta["has_form"] = "<form" in content
            meta["embeds"] = sorted(set(re.findall(r"<iframe[^>]*\bsrc=[\"']([^\"']+)", content)))

            base = OUT / kind / rel
            base.parent.mkdir(parents=True, exist_ok=True)
            base.with_name(base.name + ".md").write_text(frontmatter(meta) + md, encoding="utf-8")
            base.with_name(base.name + ".html").write_text(content, encoding="utf-8")
            hp = OUT / "raw" / "html" / kind / (rel + ".html")
            hp.parent.mkdir(parents=True, exist_ok=True)
            hp.write_text(full, encoding="utf-8")

            for m in UPLOADS.finditer(content + " " + full):
                usage.setdefault(upload_key(m.group(1)), set()).add(f"{kind}/{rel}")
            words = len(re.findall(r"\w+", re.sub(r"!?\[[^\]]*\]\([^)]*\)", "", md)))
            docs = sorted({l for l in links if re.search(r"\.(pdf|docx?|xlsx?|pptx?|zip)(\?|$)", l, re.I)})
            external = sorted({l for l in links if l.startswith("http") and "tsn-elternrat.ch" not in l})
            entries.append({**meta, "file": f"{kind}/{rel}.md", "words": words, "images": len(images), "documents": docs, "external_links": external, "http_status": st})
            time.sleep(0.15)
    write_json(OUT / "entries.json", entries)

    # navigation as rendered on the home page
    st, _, body = fetch(BASE + "/")
    home_html = body.decode("utf-8", "replace")
    (OUT / "raw" / "html" / "_frontpage.html").write_text(home_html, encoding="utf-8")
    nav = []
    for block in re.findall(r"<nav\b.*?</nav>", home_html, flags=re.S | re.I):
        for href, label in re.findall(r"<a\b[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", block, flags=re.S | re.I):
            item = {"label": re.sub(r"\s+", " ", plain(label)), "href": html.unescape(href)}
            if item["label"] and not item["href"].startswith("javascript:") and item not in nav:
                nav.append(item)
    write_json(OUT / "navigation.json", nav)

    print("-> media downloads")
    media_meta, jobs = [], []
    for m in data["media"]:
        src = m.get("source_url") or ""
        mm = UPLOADS.match(src)
        sub = urllib.parse.unquote(mm.group(1)) if mm else f"_other/{m['id']}-{Path(urllib.parse.urlparse(src).path).name}"
        parts = [re.sub(r"[^A-Za-z0-9._ -]", "_", x) for x in sub.split("/") if x not in ("", ".", "..")]
        local = Path("media").joinpath(*parts)
        det = m.get("media_details") or {}
        attached = by_id.get(m.get("post") or 0)
        media_meta.append({
            "wp_id": m["id"],
            "title": plain(m.get("title", {}).get("rendered")),
            "alt": m.get("alt_text") or "",
            "caption": plain(m.get("caption", {}).get("rendered")),
            "mime_type": m.get("mime_type"),
            "date": m.get("date"),
            "source_url": src,
            "file": str(local),
            "width": det.get("width"),
            "height": det.get("height"),
            "attached_to": plain(attached["title"]["rendered"]) if attached else None,
            "used_in": sorted(usage.get(upload_key(sub), [])),
        })
        jobs.append((src, OUT / local))

    def download(job):
        src, dest = job
        if dest.exists() and dest.stat().st_size > 0:
            return dest.stat().st_size, None
        try:
            # URLs may contain non-ASCII characters
            parts = urllib.parse.urlsplit(src)
            safe = urllib.parse.urlunsplit(parts._replace(path=urllib.parse.quote(urllib.parse.unquote(parts.path))))
            st, _, body = fetch(safe)
            if st != 200:
                return 0, f"HTTP {st}"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(body)
            return len(body), None
        except Exception as e:  # noqa: BLE001
            return 0, str(e)

    total, failed = 0, []
    with ThreadPoolExecutor(max_workers=4) as pool:
        for (src, _), meta, (size, err) in zip(jobs, media_meta, pool.map(download, jobs)):
            meta["bytes"] = size
            total += size
            if err:
                meta["error"] = err
                failed.append((src, err))
    write_json(OUT / "media.json", media_meta)

    # uploads referenced in content but missing from the media library
    known = {upload_key(m["file"][len("media/"):]) for m in media_meta}
    orphans = sorted(k for k in usage if k not in known)
    write_json(OUT / "raw" / "referenced-but-not-in-library.json", {k: sorted(usage[k]) for k in orphans})

    # ------------------------------------------------------------ INDEX.md
    rest_links = {e["url"].rstrip("/") for e in entries}
    extra = sorted(u for u in sitemap_urls if u.rstrip("/") not in rest_links)
    used = [m for m in media_meta if m["used_in"]]
    by_mime = {}
    for m in media_meta:
        by_mime.setdefault(m["mime_type"], [0, 0])
        by_mime[m["mime_type"]][0] += 1
        by_mime[m["mime_type"]][1] += m["bytes"]

    nav_hrefs = {n["href"].replace("http://", "https://") for n in nav}
    L = ["# Legacy site scrape: tsn-elternrat.ch", "",
         f"Scraped {time.strftime('%Y-%m-%d %H:%M')} via the public WordPress REST API.", "",
         f"- Pages: {len(data['pages'])}, posts: {len(data['posts'])}",
         f"- Media library: {len(media_meta)} files, {total / 1e6:.1f} MB; {len(used)} referenced on a page, {len(media_meta) - len(used)} not referenced anywhere",
         f"- Download failures: {len(failed)}", "",
         "## Pages and posts", "",
         "| Title | Path | Parent | Modified | Words | Images | Docs | Notes |", "|---|---|---|---|---|---|---|---|"]
    for e in sorted(entries, key=lambda x: (x["type"], x["file"])):
        L.append(f"| {e['title']} | [{e['file']}]({e['file']}) | {e['parent'] or ''} | {(e['modified'] or '')[:10]} | {e['words']} | {e['images']} | {len(e['documents'])} | {', '.join(x for x in ['form' if e.get('has_form') else '', f"{len(e['embeds'])} embed(s)" if e.get('embeds') else '', 'content from theme' if e.get('content_source') else '', '' if e['url'] in nav_hrefs else 'not in menu'] if x)} |")
    L += ["", "## Navigation (as rendered on the front page)", ""]
    L += [f"- {n['label']} -> {n['href']}" for n in nav] or ["(none found)"]
    L += ["", "## Media by type", "", "| MIME type | Files | MB |", "|---|---|---|"]
    L += [f"| {k} | {v[0]} | {v[1] / 1e6:.1f} |" for k, v in sorted(by_mime.items(), key=lambda kv: -kv[1][1])]
    L += ["", "## Sitemap URLs not covered by pages/posts", ""]
    L += [f"- {u}" for u in extra] or ["(none)"]
    L += ["", "## Uploads referenced in content but missing from the media library", ""]
    L += [f"- {k} (in {', '.join(sorted(usage[k]))})" for k in orphans] or ["(none)"]
    if failed:
        L += ["", "## Failed downloads", ""] + [f"- {s}: {e}" for s, e in failed]
    (OUT / "INDEX.md").write_text("\n".join(L) + "\n", encoding="utf-8")

    print(f"done: {len(entries)} entries, {len(media_meta)} media ({total / 1e6:.1f} MB), {len(failed)} failed, {len(orphans)} orphan refs, {len(extra)} extra sitemap urls")


if __name__ == "__main__":
    main()
