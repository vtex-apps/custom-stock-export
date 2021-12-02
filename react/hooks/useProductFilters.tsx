import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import type { QuantityFilterInput } from 'vtex.inventory-graphql'
import type { usePagination } from 'vtex.logistics-carrier-commons'
import { useAmplitude } from 'vtex.logistics-carrier-commons'
import { useEffect } from 'react'

import type { QuantityFilters, QuantitySubject } from './useQuantityFilters'
import { useQuantityFilters } from './useQuantityFilters'
import type {
  WarehouseFilter,
  WarehouseSubject,
  WarehousesMap,
} from './useWarehouseFilter'
import { useWarehouseFilter } from './useWarehouseFilter'
import { filtersMessages as messages } from '../utils/intl'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultFunctionType = (...args: any[]) => any

export type HandleVariablesChangeFunction<
  T extends DefaultFunctionType = DefaultFunctionType
> = (
  onVariablesChange: T,
  onCancelChange?: () => void
) => (...args: Parameters<T>) => ReturnType<T> | void

export interface FilterQuery {
  minQuantity: QuantityFilterInput['min']
  maxQuantity: QuantityFilterInput['max']
  minReservedQuantity: QuantityFilterInput['min']
  maxReservedQuantity: QuantityFilterInput['max']
  minAvailableQuantity: QuantityFilterInput['min']
  maxAvailableQuantity: QuantityFilterInput['max']
  warehouseIds?: string
}

export type Verb = 'lessOrEqual' | 'greaterOrEqual' | 'between' | 'includes'

export interface Statement<S, T> {
  label?: string
  error?: unknown
  verb: Verb | null
  subject?: S
  object?: T
}

export interface StatementProps<T> {
  value: T | null
  error: unknown
  onChange: (newValue: T | null) => void
}

type FilterStatements = Array<
  | Statement<QuantitySubject, QuantityFilterInput>
  | Statement<WarehouseSubject, WarehousesMap>
>

function useFilterUsageEvents() {
  const { query = {} } = useRuntime()
  const { logEvent } = useAmplitude()

  useEffect(() => {
    if (query.minQuantity != null || query.maxQuantity != null) {
      logEvent('Inventory Filtered', {
        'Filter Type': 'Last Update',
      })
    }
  }, [logEvent, query.maxQuantity, query.minQuantity])

  useEffect(() => {
    if (
      query.minReservedQuantity != null ||
      query.maxReservedQuantity != null
    ) {
      logEvent('Inventory Filtered', {
        'Filter Type': 'Reserved',
      })
    }
  }, [logEvent, query.minReservedQuantity, query.maxReservedQuantity])

  useEffect(() => {
    if (
      query.minAvailableQuantity != null ||
      query.maxAvailableQuantity != null
    ) {
      logEvent('Inventory Filtered', {
        'Filter Type': 'Available',
      })
    }
  }, [logEvent, query.minAvailableQuantity, query.maxAvailableQuantity])

  useEffect(() => {
    if (query.warehouseIds != null) {
      logEvent('Inventory Filtered', {
        'Filter Type': 'Warehouse',
      })
    }
  }, [logEvent, query.warehouseIds])
}

interface ProductFiltersHookParameters {
  resetPaginationVariables: ReturnType<
    typeof usePagination
  >['resetPaginationVariables']
  onStatementsChange?: HandleVariablesChangeFunction<
    (statements: FilterStatements) => void
  >
  initialState?: QuantityFilters & WarehouseFilter
}

export function useProductFilters({
  resetPaginationVariables,
  onStatementsChange,
  initialState,
}: ProductFiltersHookParameters) {
  const { setQuery } = useRuntime()

  const intl = useIntl()

  const quantityFilters = useQuantityFilters(initialState)
  const warehouseFilter = useWarehouseFilter(initialState)

  function handleStatementsChange(statements: FilterStatements = []) {
    const newQuery: FilterQuery = {
      minQuantity: undefined,
      maxQuantity: undefined,
      minReservedQuantity: undefined,
      maxReservedQuantity: undefined,
      minAvailableQuantity: undefined,
      maxAvailableQuantity: undefined,
      warehouseIds: undefined,
    }

    for (const statement of statements) {
      if (
        statement.subject === 'quantity' ||
        statement.subject === 'reservedQuantity' ||
        statement.subject === 'availableQuantity'
      ) {
        Object.assign(newQuery, quantityFilters.handleChange(statement))
      } else if (statement.subject === 'warehouseIds') {
        Object.assign(newQuery, warehouseFilter.handleChange(statement))
      }
    }

    setQuery({ ...newQuery, ...resetPaginationVariables })
  }

  const filter = { ...warehouseFilter.filter, ...quantityFilters.filter }

  const props = {
    submitFilterLabel: intl.formatMessage(messages.ok),
    alwaysVisibleFilters: Object.keys(filter),
    statements: [...warehouseFilter.statements, ...quantityFilters.statements],
    onChangeStatements: onStatementsChange
      ? onStatementsChange(handleStatementsChange)
      : handleStatementsChange,
    options: { ...warehouseFilter.options, ...quantityFilters.options },
  }

  useFilterUsageEvents()

  return { props, filter, urlError: warehouseFilter.urlError }
}
