export const formatHours = (hours: number) => `${hours.toFixed(1)}h`

export const toCsv = (headers: string[], rows: Array<Array<string | number>>) => {
  const escape = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`
  return [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))].join("\n")
}

export const downloadCsv = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
