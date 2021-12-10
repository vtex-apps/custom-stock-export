import type { Inventory, Sku, SkuWithInventory } from '../interfaces'
import type { Balance } from '../interfaces/inventory'

/* eslint-disable no-console */
export async function getInventory(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const {
    clients: { inventoryClient },
  } = ctx

  const { filteredListOfSkusByName } = ctx.state
  const skuInventoryList: Inventory[] = []

  try {
    for (const sku of filteredListOfSkusByName) {
      // eslint-disable-next-line no-await-in-loop
      const getInventoryResponse = await inventoryClient.getInventory(sku.Id)
      const skuInventoryData = getInventoryResponse.data
      const skuInventoryDataWithAvailable: Inventory = skuInventoryData

      skuInventoryDataWithAvailable.balance = skuInventoryData.balance.map(
        (balance: Balance) => {
          /* const available =
            balance.totalQuantity >= 1000000
              ? 'Inf'
              : balance.totalQuantity - balance.reservedQuantity
          */

          const available =
            balance.totalQuantity < 1000000
              ? balance.totalQuantity - balance.reservedQuantity
              : balance.totalQuantity

          const balanceAux = balance

          balance.available = available

          return balanceAux
        }
      )

      skuInventoryList.push(skuInventoryDataWithAvailable)
    }

    const skuListWithInventory: SkuWithInventory[] = filteredListOfSkusByName.map(
      (sku: Sku, index: number) => {
        const skuWithInventory: SkuWithInventory = {
          sku,
          inventory: skuInventoryList[index].balance,
        }

        return skuWithInventory
      }
    )

    ctx.state.skuListWithInventory = skuListWithInventory
    ctx.status = 200
    ctx.body = skuListWithInventory
  } catch (error) {
    console.info('error', error)
    ctx.status = 500
    ctx.body = error

    return
  }

  await next()
}
