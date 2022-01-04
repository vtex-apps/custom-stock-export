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

    // TODO: https://projects-northlatam.atlassian.net/browse/APUB-380?atlOrigin=eyJpIjoiOThjMmQxYTYzYTI2NDcxY2I1OTkzNWNhNjA1MTJkMmUiLCJwIjoiaiJ9
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
