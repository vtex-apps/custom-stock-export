import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class SearchClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search`,
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

  public async searchProducts(from: number, to: number, ft: string) {
    const withRange = `?_from=${from}&_to=${to}&ft=${ft}`

    return this.http.getRaw(withRange)
  }
}
