import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class InventoryClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/logistics`,
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

  public async getInventory(skuId: number) {
    return this.http.getRaw(`/pvt/inventory/skus/${skuId}`)
  }
}
