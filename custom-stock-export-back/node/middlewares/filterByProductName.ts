// import type { FilteredListOfProductsByIdType } from '../interfaces'

export async function filterByProductName(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { productName, productNameOperator } = ctx.state.body
  const { skuList } = ctx.state

  if (productName && productNameOperator && skuList) {
    try {
      const condition = (
        skuProductName: string,
        productNameToCompare: string
      ) => {
        const skuProductNameLower = skuProductName.toLowerCase()
        const productNameToCompareLower = productNameToCompare.toLowerCase()

        if (productNameOperator === '=') {
          return skuProductNameLower === productNameToCompareLower
        }

        if (productNameOperator === '!=') {
          return skuProductNameLower !== productNameToCompareLower
        }

        if (productNameOperator === 'contains') {
          return skuProductNameLower.includes(productNameToCompareLower)
        }

        return false
      }

      const filteredListOfSkusByName = skuList.filter((sku) =>
        condition(sku.ProductName, productName)
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
