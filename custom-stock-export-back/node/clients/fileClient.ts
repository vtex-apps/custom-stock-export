/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IOContext, InstanceOptions } from '@vtex/api'
import { AppClient } from '@vtex/api'

import type { IncomingFile } from '../interfaces'

const appId = process.env.VTEX_APP_ID
const [runningAppName] = appId ? appId.split('@') : ['']

const routes = {
  Assets: () => `/assets/${runningAppName}`,
  FileUpload: (bucket: string, path: string) =>
    `${routes.Assets()}/save/${bucket}/${path}`,
}

export default class FileManager extends AppClient {
  constructor(ioContext: IOContext, opts: InstanceOptions = {}) {
    super('vtex.file-manager@0.x', ioContext, opts)
  }

  public saveFile = async (
    file: IncomingFile,
    stream: any,
    bucket: string,
    name: string
    // eslint-disable-next-line max-params
  ): Promise<{ url: string; name: string }> => {
    try {
      const { filename, encoding, mimeType } = file

      const headers = {
        'Content-Type': mimeType,
        'Content-Encoding': encoding,
      }

      const url: string = await this.http.put(
        routes.FileUpload(bucket, filename),
        stream,
        {
          headers,
        }
      )

      return {
        url,
        name,
      }
    } catch (e) {
      console.log('e', e)
      throw new Error(e)
    }
  }
}
