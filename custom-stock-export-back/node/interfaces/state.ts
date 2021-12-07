import type { RecorderState } from '@vtex/api'

import type { ExportBodyType, ListOfProductsAndSkusType } from '.'

export interface State extends RecorderState {
  body: ExportBodyType
  listOfProductsAndSkus: ListOfProductsAndSkusType
  filteredListOfProductsById: { [key: string]: number[] }
}
