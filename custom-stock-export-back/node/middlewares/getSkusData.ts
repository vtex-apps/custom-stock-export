import { LogLevel } from '@vtex/api'

import type { Sku } from '../interfaces'

export async function getSkusData(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const {
    clients: { catalogClient },
  } = ctx

  console.log('getSkusData start')
  ctx.vtex.logger.log(
    {
      message: 'getListOfProductsAndSkus start',
    },
    LogLevel.Info
  )
  const { filteredListOfProductsByName } = ctx.state
  const skuList = []

  try {
    let i = 0

    for (const product in filteredListOfProductsByName) {
      console.log('n producto: ', i)
      i++
      for (const sku of filteredListOfProductsByName[product]) {
        // eslint-disable-next-line no-await-in-loop
        const getSkuResponse = await catalogClient.getSku(sku)
        const skuData: Sku = getSkuResponse.data

        skuList.push(skuData)
      }
    }

    ctx.state.skuList = skuList
    console.log('getSkusData end')

    ctx.vtex.logger.log(
      {
        message: 'getListOfProductsAndSkus end',
      },
      LogLevel.Info
    )
  } catch (err) {
    console.log('getSkusData error: ', err)
    ctx.status = 500
    ctx.body = err
    ctx.vtex.logger.log(
      {
        message: 'Error getSkusData',
        detail: {
          error: err,
        },
      },
      LogLevel.Error
    )

    return
  }

  await next()
}
