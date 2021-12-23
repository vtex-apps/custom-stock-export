/* eslint-disable @typescript-eslint/no-explicit-any */
export const jsonToCsv = (json: any) => {
  const fields = Object.keys(json[0])
  const replacer = (_key: any, value: any) => {
    return value === null ? '' : value
  }

  let csv = json.map(function createCsv(row: { [x: string]: any }) {
    return fields
      .map(function createRow(fieldName) {
        return JSON.stringify(row[fieldName], replacer)
      })
      .join(',')
  })

  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n')

  return csv
}
