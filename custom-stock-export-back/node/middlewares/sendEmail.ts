/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */

import type { BodyEmail } from '../interfaces'

export async function sendEmail(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { emailClient },
  } = ctx

  console.log('sendEmail')
  const { filteredListWithInventoryByQuantity } = ctx.state

  // console.log('filteredListWithInventoryByQuantity', filteredListWithInventoryByQuantity )

  try {
    const appId = process.env.VTEX_APP_ID ? process.env.VTEX_APP_ID : ''
    const { customStockExportTemplate } = await ctx.clients.apps.getAppSettings(
      appId
    )

    console.log('customStockExportTemplate', customStockExportTemplate)

    const bodyEmail: BodyEmail = {
      providerName: 'no-reply',
      templateName: customStockExportTemplate || 'custom-stock-export',
      jsonData: {
        to: ['german.bonacchi@vtex.com.br'],
        tradingName: 'customStockExport Test',
        downloadLink: 'https://www.google.com',
      },
    }

    const sendEmailResponse = await emailClient.sendEmail(bodyEmail)

    console.log(sendEmailResponse)
    ctx.status = 200
    ctx.body = {
      data: 'Send email succesfully',
      json: filteredListWithInventoryByQuantity,
    }
  } catch (err) {
    console.error('err', err)
    ctx.status = 500
    ctx.body = { error: 'Error sending email', message: err }
  }

  await next()
}
