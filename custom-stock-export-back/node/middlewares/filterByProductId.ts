import { LogLevel } from '@vtex/api'

export async function filterByProductId(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { productId: bodyProductId } = ctx.state.body
  const { listOfProductsAndSkus } = ctx.state

  if (bodyProductId) {
    const { value: productId, operator: productIdOperator } = bodyProductId

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

        const filteredListOfProductsById = Object.keys(
          listOfProductsAndSkus.data
        )
          .filter((key) => condition(key, productId))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: listOfProductsAndSkus.data[key],
            }
          }, {})

        ctx.state.filteredListOfProductsById = filteredListOfProductsById
        ctx.vtex.logger.log(
          {
            message: 'filterByProductId',
            detail: {
              filteredListOfProductsById,
            },
          },
          LogLevel.Info
        )
      } catch (error) {
        ctx.status = 500
        ctx.body = error

        return
      }
    } else {
      ctx.state.filteredListOfProductsById = listOfProductsAndSkus.data
      ctx.vtex.logger.log(
        {
          message: 'filterByProductId',
          detail: {
            filteredListOfProductsById: listOfProductsAndSkus.data,
          },
        },
        LogLevel.Info
      )
    }
  } else {
    ctx.state.filteredListOfProductsById = listOfProductsAndSkus.data
    ctx.vtex.logger.log(
      {
        message: 'filterByProductId',
        detail: {
          filteredListOfProductsById: listOfProductsAndSkus.data,
        },
      },
      LogLevel.Info
    )
  }

  await next()
}
