export type CsvValue = string | number | null | undefined

export function toCsv(headers: string[], rows: CsvValue[][]): string {
  const escapeCell = (value: CsvValue) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`

  const lines = rows.map((row) => row.map(escapeCell).join(","))
  return [headers.map(escapeCell).join(","), ...lines].join("\n")
}

export function downloadCsv(filename: string, headers: string[], rows: CsvValue[][]) {
  const csv = toCsv(headers, rows)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function slugifyFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}