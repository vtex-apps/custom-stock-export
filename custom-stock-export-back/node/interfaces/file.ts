export interface IncomingFile {
  filename: string
  mimeType: string
  encoding: string
}

export interface FileResponse {
  url: FileData[] | void
  name: string
}

export interface FileData {
  name: string
}
