import { LogLevel } from '@vtex/api'

export async function filterByProductName(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  console.log('filterByProductName start')
  ctx.vtex.logger.log(
    {
      message: 'filterByProductName start',
    },
    LogLevel.Info
  )
  const {
    clients: { searchClient },
  } = ctx

  const { productName: bodyProductName } = ctx.state.body
  const { filteredListOfProductsById } = ctx.state

  if (bodyProductName) {
    const {
      value: productName,
      operator: productNameOperator,
    } = bodyProductName

    if (productName && productNameOperator && filteredListOfProductsById) {
      try {
        const from = 0
        const to = 49
        const firstResponse = await searchClient.searchProducts(
          from,
          to,
          productName
        )

        const total = parseInt(
          firstResponse.headers.resources.split('/')[1],
          10
        )

        const { data } = firstResponse
        let fullData = data

        if (total > to) {
          const morePagesValue = 50

          for (let i = from + morePagesValue; i <= total; i += morePagesValue) {
            // eslint-disable-next-line no-await-in-loop
            const response = await searchClient.searchProducts(
              i,
              i + morePagesValue - 1,
              productName
            )

            fullData = [...fullData, ...response.data]
          }
        }

        const productsNameAndId = fullData.map(
          (product: { productId: string; productName: string }) => ({
            productId: product.productId,
            productName: product.productName,
          })
        )

        let filteredListOfProductsByName: { [key: string]: number[] }
        const condition = (key: string, id: string) => {
          if (productNameOperator === '=') {
            return key === id
          }

          if (productNameOperator === '!=') {
            return key !== id
          }

          return false
        }

        if (productNameOperator === 'contains') {
          const idsToFilter: string[] = productsNameAndId.map(
            (product: { productId: string }) => product.productId
          )

          filteredListOfProductsByName = Object.keys(filteredListOfProductsById)
            .filter((key) => idsToFilter.includes(key))
            .reduce((obj, key) => {
              return {
                ...obj,
                [key]: filteredListOfProductsById[key],
              }
            }, {})
        } else {
          const idFinded = productsNameAndId
            .filter(
              (product: { productId: string; productName: string }) =>
                product.productName.toLowerCase() === productName.toLowerCase()
            )
            .map((product: { productId: string }) => product.productId)

          filteredListOfProductsByName = Object.keys(filteredListOfProductsById)
            .filter((key) => condition(key, idFinded[0]))
            .reduce((obj, key) => {
              return {
                ...obj,
                [key]: filteredListOfProductsById[key],
              }
            }, {})
        }

        ctx.state.filteredListOfProductsByName = filteredListOfProductsByName

        ctx.vtex.logger.log(
          {
            message: 'filterByProductName end',
          },
          LogLevel.Info
        )
        console.log('filterByProductName end')
      } catch (error) {
        ctx.status = 500
        ctx.body = error

        return
      }
    } else {
      ctx.state.filteredListOfProductsByName = filteredListOfProductsById
      ctx.vtex.logger.log(
        {
          message: 'filterByProductName',
        },
        LogLevel.Info
      )
    }
  } else {
    ctx.state.filteredListOfProductsByName = filteredListOfProductsById
    ctx.vtex.logger.log(
      {
        message: 'filterByProductName',
      },
      LogLevel.Info
    )
  }

  await next()
}
