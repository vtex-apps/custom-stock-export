import { LogLevel } from '@vtex/api'

export async function filterByProductName(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { productName: bodyProductName } = ctx.state.body
  const { skuList } = ctx.state

  if (bodyProductName) {
    const {
      value: productName,
      operator: productNameOperator,
    } = bodyProductName

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

        ctx.vtex.logger.log(
          {
            message: 'filterByProductName',
            detail: {
              filteredListOfSkusByName,
            },
          },
          LogLevel.Info
        )
      } catch (error) {
        console.info('error', error)
        ctx.status = 500
        ctx.body = error

        return
      }
    } else {
      ctx.state.filteredListOfSkusByName = skuList
      ctx.vtex.logger.log(
        {
          message: 'filterByProductName',
          detail: {
            filteredListOfSkusByName: skuList,
          },
        },
        LogLevel.Info
      )
    }
  } else {
    ctx.state.filteredListOfSkusByName = skuList
    ctx.vtex.logger.log(
      {
        message: 'filterByProductName',
        detail: {
          filteredListOfSkusByName: skuList,
        },
      },
      LogLevel.Info
    )
  }

  await next()
}
