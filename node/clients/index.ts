import { IOClients } from '@vtex/api'

import SkuByEanClient from './skuByEanClient'
import MultipleEanClient from './multipleEanClient'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get skuByEan() {
    return this.getOrSet('skuByEan', SkuByEanClient)
  }

  public get multipleEan() {
    return this.getOrSet('multipleEan', MultipleEanClient)
  }
}
