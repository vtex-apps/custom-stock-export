export interface ListOfProductsAndSkusType {
  data: { [key: string]: number[] }
  range: Range
}

export interface Range {
  total: number
  from: number
  to: number
}
