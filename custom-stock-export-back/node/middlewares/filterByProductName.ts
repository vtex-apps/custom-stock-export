// import type { FilteredListOfProductsByIdType } from '../interfaces'

export async function filterByProductName(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { productName } = ctx.state.body
  const { skuList } = ctx.state

  if (productName && skuList) {
    try {
      const filteredListOfSkusByName = skuList.filter((sku) =>
        sku.ProductName.toLowerCase().includes(productName.toLowerCase())
      )

      ctx.state.filteredListOfSkusByName = filteredListOfSkusByName
    } catch (error) {
      console.info('error', error)
      ctx.status = 500
      ctx.body = error

      return
    }
  } else {
    ctx.state.filteredListOfSkusByName = skuList
  }

  await next()
}
