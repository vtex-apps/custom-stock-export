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
            context.storeUserAuthToken ?? context.authToken,
        },
      }
    )
  }

  public async listOfProductsAndSkus(categoryId: number) {
    return this.http.getRaw(categoryId ? `?categoryId=${categoryId}` : ``)
  }
}
