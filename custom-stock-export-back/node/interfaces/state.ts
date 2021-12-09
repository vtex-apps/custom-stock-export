import type { RecorderState } from '@vtex/api'

import type { ExportBodyType, ListOfProductsAndSkusType, Sku } from '.'

export interface State extends RecorderState {
  body: ExportBodyType
  listOfProductsAndSkus: ListOfProductsAndSkusType
  filteredListOfProductsById: { [key: string]: number[] }
  skuList: Sku[]
  filteredListOfSkusByName: Sku[]
}
