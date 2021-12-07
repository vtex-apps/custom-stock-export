import { IOClients } from '@vtex/api'

import GetProductAndSkuIdsClient from './getProductAndSkuIdsClient'

export class Clients extends IOClients {
  public get getProductAndSkuIdsClient() {
    return this.getOrSet('getProductAndSkuIdsClient', GetProductAndSkuIdsClient)
  }
}
