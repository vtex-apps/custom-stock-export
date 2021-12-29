/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
// import type { ReadStream } from 'fs'
// import { Readable } from 'stream'

// import * as fs from 'fs'
import { Readable } from 'stream'

import { v4 as uuidv4 } from 'uuid'
import FormData from 'form-data'
import Blob from 'fetch-blob'

import { formatJsonToConvertCsv } from '../utils/formatJsonToConvertCsv'
import { filterColumns } from '../utils/filterColumns'
import { jsonToCsv } from '../utils/jsonToCsv'

export async function createCSV(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { fileClient, fileAriClient },
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

    console.log('csv', csv)

    const contentType = 'text/csv'

    const csvFile = new Blob([csv], { type: contentType })

    console.log('csvFile', csvFile)
    ctx.state.csvFile2 = csv

    // ctx.state.csvFile = csvFile
    const name = 'csvStock.csv'
    const encoding = '7bit'
    const mimeType = contentType

    const [extension] = name?.split('.')?.reverse()
    const filename = `${uuidv4()}.${extension}`
    const incomingFile = { filename, mimeType, encoding }

    console.log('incomingFile', incomingFile)
    // const readableStream = fs.createReadStream(await csvFile.arrayBuffer())

    const readable = Readable.from(csv)

    // const hugeStream = fs.createReadStream('my.csv')
    const formData = new FormData()

    formData.append('file', readable)

    const responseFileClient = await fileClient.uploadFile(formData)

    console.log('responseFileClient', responseFileClient)
    console.log('data', responseFileClient.data)

    const responseFileAriClient = await fileAriClient.saveFile(
      incomingFile,
      csvFile.stream(),
      'CSV',
      name
    )

    console.log('responseFileAriClient', responseFileAriClient)
    console.log('url', responseFileAriClient.url)
    await next()
  } catch (err) {
    console.error('err', err)
    ctx.status = 500
    ctx.body = { error: 'Error creating CSV', message: err }
  }
}
