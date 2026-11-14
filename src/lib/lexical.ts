/** Kleine Helfer, um Fliesstext im Lexical-Format zu erzeugen (für Vorgaben und Skripte). */

type Teil = string | { text: string; url: string }

const knoten = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 }
const text = (t: string) => ({
  type: 'text',
  version: 1,
  text: t,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
})

/** Ein Absatz; Teile mit url werden zu Links. */
export function absatz(...teile: Teil[]) {
  return {
    root: {
      type: 'root',
      ...knoten,
      children: [
        {
          type: 'paragraph',
          ...knoten,
          textFormat: 0,
          children: teile.map((t) =>
            typeof t === 'string'
              ? text(t)
              : {
                  type: 'link',
                  ...knoten,
                  version: 3,
                  fields: { url: t.url, newTab: false, linkType: 'custom' },
                  children: [text(t.text)],
                },
          ),
        },
      ],
    },
  }
}
