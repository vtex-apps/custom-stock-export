/* eslint-disable @typescript-eslint/no-explicit-any */

export const queries = {
  getProductBySpecificationFilter: async (
    _: unknown,
    { ean }: any,
    ctx: Context
  ): Promise<any> => {
    const { idMultipleEan } = await ctx.clients.apps.getAppSettings(
      `${process.env.VTEX_APP_ID}`
    )

    return ctx.clients.multipleEan.getProductBySpecificationFilter(
      idMultipleEan,
      ean
    )
  },
}
