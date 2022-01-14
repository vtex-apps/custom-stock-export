import type { RecorderState } from '@vtex/api'

import type {
  ExportBodyType,
  ListOfProductsAndSkusType,
  Sku,
  SkuWithInventory,
} from '.'

export interface State extends RecorderState {
  body: ExportBodyType
  listOfProductsAndSkus: ListOfProductsAndSkusType
  filteredListOfProductsById: { [key: string]: number[] }
  filteredListOfProductsByName: { [key: string]: number[] }
  skuList: Sku[]
  skuListWithInventory: SkuWithInventory[]
  filteredListWithInventoryByWarehouseIds: SkuWithInventory[]
  filteredListWithInventoryByQuantity: SkuWithInventory[]
  jsonFilteredColums: unknown
  csvUrl: string
}
