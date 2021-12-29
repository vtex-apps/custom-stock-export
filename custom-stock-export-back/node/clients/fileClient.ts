import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class FileClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://customstockexport--${context.account}.myvtex.com/_v/file-manager-rest/uploadFile`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie:
            context.adminUserAuthToken ?? context.authToken,
        },
      }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async uploadFile(file: any) {
    return this.http.postRaw('', file)
  }
}
