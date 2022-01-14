import { LogLevel } from '@vtex/api'

import type { BodyEmail } from '../interfaces'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendEmail(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { emailClient },
  } = ctx
  console.log('sendEmail start')
  const { jsonFilteredColums } = ctx.state

  try {
    const appId = process.env.VTEX_APP_ID ? process.env.VTEX_APP_ID : ''
    const { customStockExportTemplate } = await ctx.clients.apps.getAppSettings(
      appId
    )

    const url = ctx.state.csvUrl

    const bodyEmail: BodyEmail = {
      providerName: 'no-reply',
      templateName: customStockExportTemplate || 'custom-stock-export',
      jsonData: {
        to: [ctx.state.body.email],
        tradingName: 'customStockExport Test',
        downloadLink: url,
      },
    }

    ctx.vtex.logger.log(
      {
        message: 'sendEmail',
        detail: {
          bodyEmail,
        },
      },
      LogLevel.Info
    )
    await emailClient.sendEmail(bodyEmail)
    console.log('sendEmail end')

    ctx.status = 200
    ctx.body = {
      message: 'Send email succesfully',
      urlCsv: ctx.state.csvUrl,
      json: jsonFilteredColums,
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Error sending email', message: err }
    ctx.vtex.logger.log(
      {
        message: 'Error sending email',
        detail: {
          error: err,
        },
      },
      LogLevel.Error
    )
  }

  await next()
}
