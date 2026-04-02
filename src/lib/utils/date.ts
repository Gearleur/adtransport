export function getLocalDateKey(value: string | null | undefined): string | null {
  if (!value) return null

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}