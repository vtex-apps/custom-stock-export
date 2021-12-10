export interface ExportBodyType {
  categoryId: number
  productId: {
    value: string
    operator: string
  }
  productName: {
    value: string
    operator: string
  }
}
