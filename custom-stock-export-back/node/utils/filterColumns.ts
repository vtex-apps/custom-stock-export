/* eslint-disable @typescript-eslint/no-explicit-any */
export const filterColumns = (columns: string[], jsonData: any) => {
  return jsonData.map((item: any) =>
    Object.keys(item)
      .filter((key) => columns.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: item[key],
        }
      }, {})
  )
}
