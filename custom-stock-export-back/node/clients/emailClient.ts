import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { BodyEmail } from '../interfaces'

export default class EmailClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/mail-service/pvt/sendmail`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie: context.authToken,
        },
      }
    )
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async sendEmail(body: BodyEmail): Promise<IOResponse<String>> {
    console.info('sendEmail client', body)

    return this.http.postRaw('', body)
  }
}
