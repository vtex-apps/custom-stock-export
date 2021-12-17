export interface ExportBodyType {
  categoryId: number
  productId: ProductFilterType
  productName: ProductFilterType
  warehouseIds: string[]
  quantity: QuantityFilterType
  reservedQuantity: QuantityFilterType
  availableQuantity: QuantityFilterType
}

interface ProductFilterType {
  value: string
  operator: string
}

interface QuantityFilterType {
  min: number
  max: number
  operator: string
}