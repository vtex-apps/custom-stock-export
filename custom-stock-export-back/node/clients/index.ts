import { IOClients } from '@vtex/api'

import GetProductAndSkuIdsClient from './getProductAndSkuIdsClient'
import SearchClient from './searchClient'
import CatalogClient from './catalogClient'
import InventoryClient from './inventoryClient'
import EmailClient from './emailClient'
import FileClient from './fileClient'

export class Clients extends IOClients {
  public get getProductAndSkuIdsClient() {
    return this.getOrSet('getProductAndSkuIdsClient', GetProductAndSkuIdsClient)
  }

  public get searchClient() {
    return this.getOrSet('searchClient', SearchClient)
  }

  public get catalogClient() {
    return this.getOrSet('catalogClient', CatalogClient)
  }

  public get inventoryClient() {
    return this.getOrSet('inventoryClient', InventoryClient)
  }

  public get emailClient() {
    return this.getOrSet('emailClient', EmailClient)
  }

  public get fileClient() {
    return this.getOrSet('fileClient', FileClient)
  }
}
