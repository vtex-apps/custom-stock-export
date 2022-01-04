import { LogLevel } from '@vtex/api'

import type { SkuWithInventory } from '../interfaces'

export async function filterByWarehouseIds(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { warehouseIds } = ctx.state.body
  const { skuListWithInventory } = ctx.state

  if (warehouseIds) {
    const skusFilteredByWarehouseIds: SkuWithInventory[] = []

    try {
      skuListWithInventory.forEach((sku) => {
        const skuAux = sku

        const skuInventoryFiltered = skuAux.inventory.filter((inventory) =>
          warehouseIds.includes(inventory.warehouseId)
        )

        if (skuInventoryFiltered.length > 0) {
          skuAux.inventory = skuInventoryFiltered
          skusFilteredByWarehouseIds.push(skuAux)
        }
      })

      ctx.state.filteredListWithInventoryByWarehouseIds = skusFilteredByWarehouseIds
    } catch (err) {
      ctx.status = 500
      ctx.body = err
      ctx.vtex.logger.log(
        {
          message: 'Error filterByWarehouseIds',
          detail: {
            error: err,
          },
        },
        LogLevel.Error
      )

      return
    }
  } else {
    ctx.state.filteredListWithInventoryByWarehouseIds = skuListWithInventory
  }

  await next()
}
