import { IOClients } from '@vtex/api'

import CatalogClient from './catalogClient'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get catalogClient() {
    return this.getOrSet('catalogClient', CatalogClient)
  }
}
