import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Die Website ist klein: Nach jeder Änderung im Admin wird sie komplett neu gerendert.
 * Ausserhalb von Next.js (z. B. im Import-Skript) gibt es keinen Cache; dort ist der Aufruf wirkungslos.
 */
async function revalidateSite(): Promise<void> {
  if (process.env.PAYLOAD_SKIP_REVALIDATE === 'true') return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // kein Next.js-Request-Kontext
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}
