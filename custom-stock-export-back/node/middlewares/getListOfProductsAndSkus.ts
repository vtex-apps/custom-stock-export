import { LogLevel } from '@vtex/api'

import type { ListOfProductsAndSkusType } from '../interfaces'

export async function getListOfProductsAndSkus(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const {
    clients: { getProductAndSkuIdsClient },
  } = ctx

  ctx.vtex.logger.log(
    {
      message: 'getListOfProductsAndSkus start',
    },
    LogLevel.Info
  )
  console.log('getListOfProductsAndSkus start')
  const { body } = ctx.state

  try {
    const { categoryId } = body
    const from = 1
    const to = 50
    const firstResponse = await getProductAndSkuIdsClient.listOfProductsAndSkus(
      categoryId,
      from,
      to
    )

    const { data, range } = firstResponse.data
    let { total } = range

    console.log('total', total)


    let fullData = data

    if (total > to) {
      const morePagesValue = 50

      for (
        let i = from + morePagesValue;
        i <= total;
        i +=
          i + morePagesValue > total && total !== i ? total - i : morePagesValue
      ) {
        console.log('range i: ', i)
        // eslint-disable-next-line no-await-in-loop
        const response = await getProductAndSkuIdsClient.listOfProductsAndSkus(
          categoryId,
          i,
          i + morePagesValue
        )

        fullData = { ...fullData, ...response.data.data }
      }
    }

    console.log('getListOfProductsAndSkus 3')

    const listOfProductsAndSkus: ListOfProductsAndSkusType = { data: fullData }

    console.log('getListOfProductsAndSkus end')
    ctx.state.listOfProductsAndSkus = listOfProductsAndSkus
    ctx.vtex.logger.log(
      {
        message: 'getListOfProductsAndSkus end',
      },
      LogLevel.Info
    )
  } catch (err) {
    ctx.status = 500
    ctx.body = err
    ctx.vtex.logger.log(
      {
        message: 'Error getListOfProductsAndSkus',
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
