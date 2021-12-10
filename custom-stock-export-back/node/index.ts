import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getBody } from './middlewares/getBody'
import { getListOfProductsAndSkus } from './middlewares/getListOfProductsAndSkus'
import { filterByProductId } from './middlewares/filterByProductId'
import { getSkusData } from './middlewares/getSkusData'
import { filterByProductName } from './middlewares/filterByProductName'
import { getInventory } from './middlewares/getInventory'
import { filterByQuantity } from './middlewares/filterByQuantity'
import type { State } from './interfaces'

const TIMEOUT_MS = 600000

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      // retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    export: method({
      POST: [
        getBody,
        getListOfProductsAndSkus,
        filterByProductId,
        getSkusData,
        filterByProductName,
        getInventory,
        filterByQuantity,
      ],
    }),
  },
})
