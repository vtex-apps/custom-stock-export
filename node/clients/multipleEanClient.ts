/* eslint-disable prettier/prettier */

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class MultipleEanClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search`, context, {
    ...options,
      headers: {
        VtexIdClientAutCookie: context.storeUserAuthToken ?? context.authToken,
      }
    })
  }

  public async getProductBySpecificationFilter(idMultipleEan: string,  ean: string) {
    return this.http.getRaw(`?fq=specificationFilter_${idMultipleEan}:**${ean}**`)
  }
}


