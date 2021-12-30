export const productImportantColumns: string[] = [
  'ProductId',
  'ProductName',
  'Id',
  'SkuName',
]

export const productImportantColumnsLabels: string[] = [
  'ProductId',
  'ProductName',
  'SkuId',
  'SkuName',
]

export const inventoryColumns: string[] = [
  'warehouseId',
  'warehouseName',
  'totalQuantity',
  'reservedQuantity',
  'availableQuantity',
]

export const inventoryColumnsLabels: string[] = [
  'WarehouseId',
  'WarehouseName',
  'TotalQuantity',
  'ReservedQuantity',
  'AvailableQuantity',
]

export const disableColumns: string[] = [
  ...productImportantColumns,
  ...inventoryColumns,
]
export const otherColumns: string[] = [
  'ProductDescription',
  'ProductRefId',
  'IsActive',
  'IsTransported',
  'IsInventoried',
  'ImageUrl',
  'DetailUrl',
  'BrandId',
  'BrandName',
  'ProductCategoryIds',
  'MeasurementUnit',
  'UnitMultiplier',
  'KeyWords',
  'ReleaseDate',
  'ProductIsVisible',
  'ShowIfNotAvailable',
  'IsProductActive',
  'ProductFinalScore',
]

export const allColumns: string[] = [
  ...productImportantColumns,
  ...otherColumns,
  ...inventoryColumns,
]

export const allColumnsLabels: string[] = [
  ...productImportantColumnsLabels,
  ...otherColumns,
  ...inventoryColumnsLabels,
]
