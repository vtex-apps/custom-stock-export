import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import type { InventoryProductsPageFilterInput } from 'vtex.inventory-graphql'
import type { QueryWarehousesListArgs } from 'vtex.logistics-carrier-graphql'

import WarehouseFilterPopup from '../components/Filters/WarehouseFilterPopup'
import type { Statement, StatementProps, Verb } from './useProductFilters'
import type { QueriedWarehouse, QueriedWarehousesNames } from '../types'
import {
  commonMessages,
  filtersMessages as messages,
  columnsMessages,
} from '../utils/intl'
import WAREHOUSES_NAMES from '../graphql/warehousesNames.graphql'

export type WarehouseFilter = Pick<
  InventoryProductsPageFilterInput,
  'warehouseIds'
>

export type WarehouseSubject = keyof WarehouseFilter

export type WarehousesMap = Map<
  QueriedWarehouse['id'],
  QueriedWarehouse['name']
>

export function useWarehouseFilter(initialState?: WarehouseFilter) {
  const { query } = useRuntime()
  const intl = useIntl()

  const filter: WarehouseFilter = {
    warehouseIds: query?.warehouseIds?.split(',') ?? initialState?.warehouseIds,
  }

  const [checked, setChecked] = useState<WarehousesMap>(new Map())
  // When loading url, we don't have warehouses names yet
  const [checkedWithoutName, setCheckedWithoutName] = useState(
    filter.warehouseIds ?? []
  )

  const { loading, error, refetch } = useQuery<
    { warehousesList: QueriedWarehousesNames },
    QueryWarehousesListArgs
  >(WAREHOUSES_NAMES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      ids: checkedWithoutName,
    },
    skip: checkedWithoutName.length === 0,
    onCompleted: (data) =>
      setChecked((prevChecked) => {
        const newChecked = new Map(prevChecked)

        data?.warehousesList?.forEach((value, index) => {
          newChecked.set(checkedWithoutName[index], value.name)
        })

        return newChecked
      }),
  })

  const urlError =
    checkedWithoutName.length > 0 && error
      ? {
          message: intl.formatMessage(messages.warehousesNamesQueryError),
          refetch,
          dismiss: () => setCheckedWithoutName([]),
        }
      : null

  const options = useMemo(
    () => ({
      warehouseIds: {
        label: intl.formatMessage(columnsMessages.warehouse),
        renderFilterLabel: (
          statement?: Statement<WarehouseSubject, WarehousesMap>
        ) => {
          if (loading) return intl.formatMessage(commonMessages.loading)
          if (!statement?.object || statement.object.size === 0) {
            return intl.formatMessage(messages.all, { gender: 'male' })
          }

          return Array.from(statement.object.values()).join(', ')
        },
        verbs: [
          {
            label: '',
            value: 'includes' as Verb,
            object: (props: StatementProps<WarehousesMap>) => (
              <WarehouseFilterPopup {...props} />
            ),
          },
        ],
      },
    }),
    [intl, loading]
  )

  const statements: Array<Statement<WarehouseSubject, WarehousesMap>> = (
    Object.entries(filter) as Array<[WarehouseSubject, string[]]>
  )
    .filter(([_, value]) => Boolean(value?.length))
    .map(([key]) => ({
      subject: key,
      verb: 'includes',
      error: null,
      object: checked,
    }))

  function handleChange(statement: Statement<WarehouseSubject, WarehousesMap>) {
    setChecked(statement?.object ?? new Map())

    return {
      warehouseIds: statement?.object?.size
        ? Array.from(statement.object.keys()).join(',')
        : undefined,
    }
  }

  return {
    filter,
    statements,
    handleChange,
    options,
    urlError,
  }
}
