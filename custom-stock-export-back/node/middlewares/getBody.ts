import { json } from 'co-body'
import { LogLevel } from '@vtex/api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBody(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)

  ctx.state.body = body
  ctx.vtex.logger.log(
    {
      message: 'getBody',
      detail: {
        body,
      },
    },
    LogLevel.Info
  )
  await next()
}
