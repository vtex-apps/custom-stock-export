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

  const { body } = ctx.state

  try {
    const { categoryId } = body

    const response = await getProductAndSkuIdsClient.listOfProductsAndSkus(
      categoryId
    )

    const listOfProductsAndSkus: ListOfProductsAndSkusType = response.data

    ctx.state.listOfProductsAndSkus = listOfProductsAndSkus
    ctx.vtex.logger.log(
      {
        message: 'getListOfProductsAndSkus',
        detail: {
          listOfProductsAndSkus,
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

  await next()
}
