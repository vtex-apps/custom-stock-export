import type { Sku } from '../interfaces'

/* eslint-disable no-console */
export async function getSkusData(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const {
    clients: { catalogClient },
  } = ctx

  const { filteredListOfProductsById } = ctx.state
  const skuList = []

  try {
    for (const product in filteredListOfProductsById) {
      for (const sku of filteredListOfProductsById[product]) {
        // eslint-disable-next-line no-await-in-loop
        const getSkuResponse = await catalogClient.getSku(sku)
        const skuData: Sku = getSkuResponse.data

        skuList.push(skuData)
      }
    }

    ctx.state.skuList = skuList
  } catch (error) {
    console.info('error', error)
    ctx.status = 500
    ctx.body = error

    return
  }

  await next()
}
