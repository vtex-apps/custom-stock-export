/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatJsonToConvertCsv = (json: any) => {
  const newJson: any = []

  json.forEach((item: any) => {
    item.inventory.forEach((inventory: any) => {
      newJson.push({ ...item.sku, inventory })
    })
  })
  const deconstructNewJson = newJson.map((item: any) => {
    return { ...item, ...item.inventory }
  })

  return deconstructNewJson
}
