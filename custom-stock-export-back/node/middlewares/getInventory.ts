import { LogLevel } from '@vtex/api'

import type { Inventory, Sku, SkuWithInventory } from '../interfaces'
import type { Balance } from '../interfaces/inventory'

export async function getInventory(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<any>
) {
  const {
    clients: { inventoryClient },
  } = ctx

  console.log('getInventory start')
  ctx.vtex.logger.log(
    {
      message: 'getInventory start',
    },
    LogLevel.Info
  )
  const { skuList } = ctx.state
  const skuInventoryList: Inventory[] = []

  try {
    for (const sku of skuList) {
      // eslint-disable-next-line no-await-in-loop
      const getInventoryResponse = await inventoryClient.getInventory(sku.Id)
      const skuInventoryData = getInventoryResponse.data
      const skuInventoryDataWithAvailable: Inventory = skuInventoryData

      skuInventoryDataWithAvailable.balance = skuInventoryData.balance.map(
        (balance: Balance) => {
          const availableQuantity =
            balance.totalQuantity < 1000000
              ? balance.totalQuantity - balance.reservedQuantity
              : balance.totalQuantity

          const balanceAux = balance

          balance.availableQuantity = availableQuantity

          return balanceAux
        }
      )

      skuInventoryList.push(skuInventoryDataWithAvailable)
    }

    const skuListWithInventory: SkuWithInventory[] = skuList.map(
      (sku: Sku, index: number) => {
        const skuWithInventory: SkuWithInventory = {
          sku,
          inventory: skuInventoryList[index].balance,
        }

        return skuWithInventory
      }
    )

    console.log('getInventory end')

    ctx.state.skuListWithInventory = skuListWithInventory

    ctx.vtex.logger.log(
      {
        message: 'getInventory end',
      },
      LogLevel.Info
    )
  } catch (err) {
    ctx.status = 500
    ctx.body = err

    ctx.vtex.logger.log(
      {
        message: 'Error getInventory',
        detail: {
          error: err,
        },
      },
      LogLevel.Error
    )

    return
  }

  await next()
}
