export interface JsonEmailData {
  to: string[]
  downloadLink: string
  tradingName?: string
}

export interface BodyEmail {
  providerName: string
  templateName: string
  jsonData: JsonEmailData
}
