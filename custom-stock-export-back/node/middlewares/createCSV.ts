import { LogLevel } from '@vtex/api'
import { v4 as uuidv4 } from 'uuid'
import Blob from 'fetch-blob'

import { formatJsonToConvertCsv } from '../utils/formatJsonToConvertCsv'
import { filterColumns } from '../utils/filterColumns'
import { jsonToCsv } from '../utils/jsonToCsv'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCSV(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { fileClient },
  } = ctx

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newJsonKeyChanged = newJsonFiltered.map((sku: any) => {
      const newSku = {
        ProductId: sku.ProductId,
        ProductName: sku.ProductName,
        SkuId: sku.Id,
        ...sku,
      }

      delete newSku.Id

      return newSku
    })

    ctx.state.jsonFilteredColums = newJsonKeyChanged
    ctx.vtex.logger.log(
      {
        message: 'createCSV',
        detail: {
          jsonFilteredColums: newJsonKeyChanged,
        },
      },
      LogLevel.Info
    )
    const csv = jsonToCsv(newJsonKeyChanged)

    const name = 'csvStock.csv'
    const encoding = '7bit'
    const mimeType = 'text/csv'

    const csvFile = new Blob([csv], { type: mimeType })

    const [extension] = name?.split('.')?.reverse()
    const filename = `${uuidv4()}.${extension}`
    const incomingFile = { filename, mimeType, encoding }

    const responseFileClient = await fileClient.saveFile(
      incomingFile,
      csvFile.stream(),
      'cf',
      name
    )

    ctx.state.csvUrl = responseFileClient.url

    ctx.vtex.logger.log(
      {
        message: 'createCSV',
        detail: {
          url: responseFileClient.url,
        },
      },
      LogLevel.Info
    )

    await next()
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Error creating CSV', message: err }
  }
}
