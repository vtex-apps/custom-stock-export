/* eslint-disable max-params */
import type { SkuWithInventory } from '../interfaces'

export async function filterByQuantity(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const { quantity, reservedQuantity, availableQuantity } = ctx.state.body

  const { filteredListWithInventoryByWarehouseIds } = ctx.state

  ctx.state.filteredListWithInventoryByQuantity = filteredListWithInventoryByWarehouseIds
  const condition = (
    skuQuantity: number,
    min: number,
    max: number,
    operator: string
  ) => {
    if (operator === 'greaterOrEqual') {
      return skuQuantity >= min
    }

    if (operator === 'lessOrEqual') {
      return skuQuantity <= max
    }

    if (operator === 'between') {
      return skuQuantity >= min && skuQuantity <= max
    }

    return false
  }

  function filterByQuantityProp(
    prop: string,
    min: number,
    max: number,
    operator: string
  ) {
    const skusFilteredByQuantity: SkuWithInventory[] = []

    if (!operator || !ctx.state.filteredListWithInventoryByQuantity) {
      return []
    }

    ctx.state.filteredListWithInventoryByQuantity.forEach((sku) => {
      const skuAux = sku

      const skuInventoryFiltered = skuAux.inventory.filter((inventory) => {
        switch (prop) {
          case 'totalQuantity':
            return condition(inventory.totalQuantity, min, max, operator)

          case 'reservedQuantity':
            return condition(inventory.reservedQuantity, min, max, operator)

          case 'availableQuantity':
            return condition(inventory.availableQuantity, min, max, operator)

          default:
            return false
        }
      })

      if (skuInventoryFiltered.length > 0) {
        skuAux.inventory = skuInventoryFiltered
        skusFilteredByQuantity.push(skuAux)
      }
    })

    return skusFilteredByQuantity
  }

  if (quantity) {
    const {
      min: minQuantity,
      max: maxQuantity,
      operator: operatorQuantity,
    } = quantity

    const skusFilteredByTotalQuantity = filterByQuantityProp(
      'totalQuantity',
      minQuantity,
      maxQuantity,
      operatorQuantity
    )

    ctx.state.filteredListWithInventoryByQuantity = skusFilteredByTotalQuantity
  }

  if (reservedQuantity) {
    const {
      min: minQuantity,
      max: maxQuantity,
      operator: operatorQuantity,
    } = reservedQuantity

    const skusFilteredByTotalQuantity = filterByQuantityProp(
      'reservedQuantity',
      minQuantity,
      maxQuantity,
      operatorQuantity
    )

    ctx.state.filteredListWithInventoryByQuantity = skusFilteredByTotalQuantity
  }

  if (availableQuantity) {
    const {
      min: minQuantity,
      max: maxQuantity,
      operator: operatorQuantity,
    } = availableQuantity

    const skusFilteredByTotalQuantity = filterByQuantityProp(
      'availableQuantity',
      minQuantity,
      maxQuantity,
      operatorQuantity
    )

    ctx.state.filteredListWithInventoryByQuantity = skusFilteredByTotalQuantity
  }

  ctx.status = 200
  ctx.body = ctx.state.filteredListWithInventoryByQuantity
  await next()
}