/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Sku {
  ProductId: number
  NameComplete: string
  ComplementName: string
  ProductName: string
  ProductDescription: string
  ProductRefId: string
  TaxCode: string
  Id: number
  SkuName: string
  IsActive: boolean
  IsTransported: boolean
  IsInventoried: boolean
  IsGiftCardRecharge: boolean
  ImageUrl: string
  DetailUrl: string
  CSCIdentification: null
  BrandId: string
  BrandName: string
  IsBrandActive: boolean
  Dimension: Dimension
  RealDimension: RealDimension
  ManufacturerCode: string
  IsKit: boolean
  KitItems: any[]
  Services: any[]
  Categories: any[]
  CategoriesFullPath: string[]
  Attachments: any[]
  Collections: any[]
  SkuSellers: SkuSeller[]
  SalesChannels: number[]
  Images: Image[]
  Videos: any[]
  SkuSpecifications: Specification[]
  ProductSpecifications: Specification[]
  ProductClustersIds: string
  PositionsInClusters: { [key: string]: number }
  ProductClusterNames: { [key: string]: string }
  ProductClusterHighlights: ProductClusterHighlights
  ProductCategoryIds: string
  IsDirectCategoryActive: boolean
  ProductGlobalCategoryId: number
  ProductCategories: { [key: string]: string }
  CommercialConditionId: number
  RewardValue: number
  AlternateIds: AlternateIDS
  AlternateIdValues: string[]
  EstimatedDateArrival: null
  MeasurementUnit: string
  UnitMultiplier: number
  InformationSource: string
  ModalType: null
  KeyWords: string
  ReleaseDate: Date
  ProductIsVisible: boolean
  ShowIfNotAvailable: boolean
  IsProductActive: boolean
  ProductFinalScore: number
}

export interface AlternateIDS {
  Ean: string
}

export interface Dimension {
  cubicweight: number
  height: number
  length: number
  weight: number
  width: number
}

export interface Image {
  ImageUrl: string
  ImageName: string
  FileId: number
}

export interface ProductClusterHighlights {
  '138': string
}

export interface Specification {
  FieldId: number
  FieldName: string
  FieldValueIds: number[]
  FieldValues: string[]
  IsFilter: boolean
  FieldGroupId: number
  FieldGroupName: string
}

export interface RealDimension {
  realCubicWeight: number
  realHeight: number
  realLength: number
  realWeight: number
  realWidth: number
}

export interface SkuSeller {
  SellerId: string
  StockKeepingUnitId: number
  SellerStockKeepingUnitId: string
  IsActive: boolean
  FreightCommissionPercentage: number
  ProductCommissionPercentage: number
}
