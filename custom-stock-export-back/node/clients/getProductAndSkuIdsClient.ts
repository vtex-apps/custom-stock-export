import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class GetProductAndSkuIdsClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/catalog_system/pvt/products/GetProductAndSkuIds`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie:
            context.adminUserAuthToken ?? context.authToken,
        },
      }
    )
  }

  public async listOfProductsAndSkus(
    categoryId: number | undefined,
    from: number,
    to: number
  ) {
    const withCategoryId = categoryId ? `?categoryId=${categoryId}` : ``
    const withRange = withCategoryId
      ? `${withCategoryId}&_from=${from}&_to=${to}`
      : `?_from=${from}&_to=${to}`

    return this.http.getRaw(withRange)
  }
}
