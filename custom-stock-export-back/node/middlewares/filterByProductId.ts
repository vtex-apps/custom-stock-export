// import type { FilteredListOfProductsByIdType } from '../interfaces'

export async function filterByProductId(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { productId } = ctx.state.body
  const { listOfProductsAndSkus } = ctx.state

  if (productId) {
    try {
      const filteredListOfProductsById = Object.keys(listOfProductsAndSkus.data)
        .filter((key) => key === productId)
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: listOfProductsAndSkus.data[key],
          }
        }, {})

      ctx.state.filteredListOfProductsById = filteredListOfProductsById

      ctx.status = 200
      ctx.body = filteredListOfProductsById
    } catch (error) {
      console.info('error', error)
      ctx.status = 500
      ctx.body = error

      return
    }
  } else {
    ctx.state.filteredListOfProductsById = listOfProductsAndSkus.data
    ctx.status = 200
    ctx.body = ctx.state.filteredListOfProductsById
  }

  await next()
}
