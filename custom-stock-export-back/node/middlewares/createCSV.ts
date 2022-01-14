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
    const { columns } = ctx.state.body
    console.log('createCSV start')
    ctx.vtex.logger.log(
      {
        message: 'createCSV columns',
        detail: {
          columns,
        },
      },
      LogLevel.Info
    )
    const newJsonFiltered = filterColumns(columns, newJson)

    ctx.vtex.logger.log(
      {
        message: 'createCSV newJsonFiltered',
      },
      LogLevel.Info
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newJsonKeyChanged = newJsonFiltered.map((sku: any) => {
      const newSku = {
        ProductId: sku.ProductId,
        ProductName: sku.ProductName,
        SkuId: sku.Id,
        ...sku,
        WarehouseId: sku.warehouseId,
        WarehouseName: sku.warehouseName,
        TotalQuantity: sku.totalQuantity,
        ReservedQuantity: sku.reservedQuantity,
        AvailableQuantity: sku.availableQuantity,
      }

      delete newSku.Id
      delete newSku.warehouseId
      delete newSku.warehouseName
      delete newSku.totalQuantity
      delete newSku.reservedQuantity
      delete newSku.availableQuantity

      return newSku
    })

    ctx.state.jsonFilteredColums = newJsonKeyChanged
    ctx.vtex.logger.log(
      {
        message: 'createCSV - jsonFilteredColums',
      },
      LogLevel.Info
    )

    if (newJsonKeyChanged.length === 0) {
      ctx.vtex.logger.log(
        {
          message: 'createCSV - jsonFilteredColums is empty',
        },
        LogLevel.Info
      )

      ctx.status = 201
      ctx.body = { message: 'Export is empty' }

      return
    }

    const csv = jsonToCsv(newJsonKeyChanged)

    ctx.vtex.logger.log(
      {
        message: 'createCSV - csv',
        detail: {
          csv,
        },
      },
      LogLevel.Info
    )
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
    console.log('createCSV end')

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
    ctx.vtex.logger.log(
      {
        message: 'Error createCSV',
        detail: {
          error: err,
        },
      },
      LogLevel.Error
    )
  }
}
