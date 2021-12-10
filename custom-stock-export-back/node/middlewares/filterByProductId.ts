// import type { FilteredListOfProductsByIdType } from '../interfaces'

export async function filterByProductId(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { productId, productIdOperator } = ctx.state.body
  const { listOfProductsAndSkus } = ctx.state

  if (productId && productIdOperator && listOfProductsAndSkus) {
    try {
      const condition = (key: string, id: string) => {
        if (productIdOperator === '=') {
          return key === id
        }

        if (productIdOperator === '!=') {
          return key !== id
        }

        return false
      }

      const filteredListOfProductsById = Object.keys(listOfProductsAndSkus.data)
        .filter((key) => condition(key, productId))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: listOfProductsAndSkus.data[key],
          }
        }, {})

      ctx.state.filteredListOfProductsById = filteredListOfProductsById
    } catch (error) {
      console.info('error', error)
      ctx.status = 500
      ctx.body = error

      return
    }
  } else {
    ctx.state.filteredListOfProductsById = listOfProductsAndSkus.data
  }

  await next()
}
