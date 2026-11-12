/** Schuljahr in der Form "2025/26". Ein Schuljahr beginnt im August. */
export function schuljahrVon(datum: Date | string): string {
  const d = typeof datum === 'string' ? new Date(datum) : datum
  const start = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1
  return `${start}/${String((start + 1) % 100).padStart(2, '0')}`
}

export const istSchuljahr = (wert: unknown): wert is string =>
  typeof wert === 'string' && /^\d{4}\/\d{2}$/.test(wert)
