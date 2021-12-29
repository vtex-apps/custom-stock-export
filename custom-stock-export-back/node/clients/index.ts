import { IOClients } from '@vtex/api'

import GetProductAndSkuIdsClient from './getProductAndSkuIdsClient'
import CatalogClient from './catalogClient'
import InventoryClient from './inventoryClient'
import EmailClient from './emailClient'
import FileClient from './fileClient'
import FileAriClient from './fileAriClient'

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

  public get emailClient() {
    return this.getOrSet('emailClient', EmailClient)
  }

  public get fileClient() {
    return this.getOrSet('fileClient', FileClient)
  }

  public get fileAriClient() {
    return this.getOrSet('fileAriClient', FileAriClient)
  }
}
