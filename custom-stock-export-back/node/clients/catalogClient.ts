import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class CatalogClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/catalog_system`,
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

  public async getSku(skuId: number) {
    return this.http.getRaw(`/pvt/sku/stockkeepingunitbyid/${skuId}`)
  }
}
