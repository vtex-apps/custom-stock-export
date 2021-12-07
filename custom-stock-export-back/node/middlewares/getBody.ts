import { json } from 'co-body'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBody(ctx: Context, next: () => Promise<any>) {
  const request = await json(ctx.req)

  ctx.state.body = request
  await next()
}
