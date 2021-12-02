import type { QueryResult } from 'react-apollo'
import type {
  InventoryProduct,
  Paging,
  InventoryProductQuantityUpdateInput,
  InventoryProductQuantityUpdateOutput,
} from 'vtex.inventory-graphql'
import type {
  Warehouse,
  Paging as LogisticsPaging,
} from 'vtex.logistics-carrier-graphql'
import type Maybe from 'graphql/tsutils/Maybe'

export type QueriedInventoryProduct = Pick<
  InventoryProduct,
  | 'id'
  | 'sku'
  | 'warehouseId'
  | 'cacheId'
  | 'name'
  | 'warehouseName'
  | 'quantity'
  | 'reservedQuantity'
  | 'availableQuantity'
  | 'unlimited'
>

export interface QueriedInventoryProductsPage {
  products: QueriedInventoryProduct[]
  paging: Pick<Paging, 'total' | 'pages'>
}

export type QueriedChangelog = Pick<
  InventoryProduct,
  'name' | 'warehouseName' | 'changelog'
>

export type QueriedWarehouse = Pick<Warehouse, 'id' | 'name'>

export type QueriedWarehousesNames = Array<Pick<QueriedWarehouse, 'name'>>

export interface QueriedWarehousesPage {
  items: QueriedWarehouse[]
  paging: Pick<LogisticsPaging, 'page' | 'pages'>
}

export type InventoryProductIds = Pick<InventoryProduct, 'sku' | 'warehouseId'>

export type QueriedInventoryProductData = Pick<
  InventoryProduct,
  | 'quantity'
  | 'availableQuantity'
  | 'reservedQuantity'
  | 'dispatchedReservations'
  | 'unlimited'
> & {
  catalogProduct: Pick<InventoryProduct['catalogProduct'], 'id'>
}

export type InventoryProductUpdateData = Pick<
  InventoryProductQuantityUpdateInput,
  'quantity' | 'unlimited'
> &
  Partial<
    Pick<InventoryProductQuantityUpdateOutput, 'errorCode' | 'errorMessage'>
  >

export type RowStatus = Pick<QueryResult, 'loading' | 'refetch'> & {
  loadingError: QueryResult['error']
  savingErrorCode: InventoryProductQuantityUpdateOutput['errorCode']
  savingErrorMessage: InventoryProductQuantityUpdateOutput['errorMessage']
  available: boolean
}

export interface LoadingInventoryProductRow {
  loading: true
  id: string
}

export type InventoryProductRow = QueriedInventoryProduct &
  Omit<QueriedInventoryProductData, 'catalogProduct'> & {
    loading: false
    updatedQuantity: InventoryProductQuantityUpdateInput['quantity']
    updatedUnlimited?: Maybe<InventoryProductQuantityUpdateInput['unlimited']>
    status: RowStatus
    catalogProduct: Maybe<QueriedInventoryProductData['catalogProduct']>
  }

export interface Motion {
  willChange: string
  transition: string
}

export interface RowRendererArgs<TData = unknown> {
  index: number
  key: string
  props: {
    data: TData
    motion: Motion
    height: React.HTMLProps<HTMLTableRowElement>['height']
  }
}

export interface RowProps {
  height: React.HTMLProps<HTMLTableRowElement>['height']
  motion: Motion
}
