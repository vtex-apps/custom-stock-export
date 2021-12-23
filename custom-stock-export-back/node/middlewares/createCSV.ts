/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */

import { formatJsonToConvertCsv } from '../utils/formatJsonToConvertCsv'
import { filterColumns } from '../utils/filterColumns'
import { jsonToCsv } from '../utils/jsonToCsv'

export async function createCSV(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { fileClient },
  } = ctx

  console.log('createCSV')
  const { filteredListWithInventoryByQuantity } = ctx.state

  try {
    const newJson = formatJsonToConvertCsv(filteredListWithInventoryByQuantity)
    const columns = [
      'ProductId',
      'ProductName',
      'Id',
      'SkuName',
      'warehouseId',
      'warehouseName',
      'totalQuantity',
      'reservedQuantity',
      'availableQuantity',
    ]

    const newJsonFiltered = filterColumns(columns, newJson)

    const csv = jsonToCsv(newJsonFiltered)
    const contentType = 'text/csv'
    const csvFile = new Blob([csv], { type: contentType })

    const formData = new FormData()

    formData.append('csvStock', csvFile, 'csvStock')

    const saveFileResponse = await fileClient.uploadFile(formData)

    console.log('saveFileResponse', saveFileResponse)
  } catch (err) {
    console.error('err', err)
    ctx.status = 500
    ctx.body = { error: 'Error sending email', message: err }
  }

  await next()
}
