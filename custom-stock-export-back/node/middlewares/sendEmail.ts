import { LogLevel } from '@vtex/api'

import type { BodyEmail } from '../interfaces'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendEmail(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { emailClient },
  } = ctx

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
        to: ['german.bonacchi@vtex.com.br'],
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

    ctx.status = 200
    ctx.body = {
      data: 'Send email succesfully',
      json: jsonFilteredColums,
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = { error: 'Error sending email', message: err }
  }

  await next()
}
