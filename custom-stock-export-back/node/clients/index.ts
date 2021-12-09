import { IOClients } from '@vtex/api'

import GetProductAndSkuIdsClient from './getProductAndSkuIdsClient'
import CatalogClient from './catalogClient'
import InventoryClient from './inventoryClient'

export class Clients extends IOClients {
  public get getProductAndSkuIdsClient() {
    return this.getOrSet('getProductAndSkuIdsClient', GetProductAndSkuIdsClient)
  }

  public get catalogClient() {
    return this.getOrSet('catalogClient', CatalogClient)
  }

  public get inventoryClient() {
    return this.getOrSet('inventoryClient', InventoryClient)
  }
}
