import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function Text({ inhalt, className }: { inhalt?: unknown; className?: string }) {
  if (!inhalt) return null
  return <RichText className={['text', className].filter(Boolean).join(' ')} data={inhalt as SerializedEditorState} />
}
