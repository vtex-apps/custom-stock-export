import type { Balance } from './inventory'
import type { Sku } from './sku'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SkuWithInventory {
  sku: Sku
  inventory: Balance[]
}
