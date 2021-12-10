import React, { useMemo, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import type {
  InventoryProductsPageFilterInput,
  QuantityFilterInput,
} from 'vtex.inventory-graphql'

import QuantityFilterPopup from '../components/Filters/QuantityFilterPopup'
import type {
  Statement,
  StatementProps,
  Verb,
  FilterQuery,
} from './useProductFilters'
import { filtersMessages as messages, columnsMessages } from '../utils/intl'

export type QuantityFilters = Pick<
  InventoryProductsPageFilterInput,
  'quantity' | 'reservedQuantity' | 'availableQuantity'
>

export type QuantitySubject = keyof QuantityFilters

export function useQuantityFilters(initialState?: QuantityFilters) {
  const { query } = useRuntime()
  const intl = useIntl()

  const getFromQuery = (queryValue?: string, initialValue?: number | null) =>
    queryValue != null && !Number.isNaN(+queryValue)
      ? +queryValue
      : initialValue

  const filter: QuantityFilters = {
    quantity: {
      min: getFromQuery(query?.minQuantity, initialState?.quantity?.min),
      max: getFromQuery(query?.maxQuantity, initialState?.quantity?.max),
    },
    reservedQuantity: {
      min: getFromQuery(
        query?.minReservedQuantity,
        initialState?.reservedQuantity?.min
      ),
      max: getFromQuery(
        query?.maxReservedQuantity,
        initialState?.reservedQuantity?.max
      ),
    },
    availableQuantity: {
      min: getFromQuery(
        query?.minAvailableQuantity,
        initialState?.availableQuantity?.min
      ),
      max: getFromQuery(
        query?.maxAvailableQuantity,
        initialState?.availableQuantity?.max
      ),
    },
  }

  const createQuantityFilterOption = useCallback(
    ({
      label,
      labelGender = 'male',
    }: {
      label: string
      labelGender?: string
    }) => {
      const dropdownOptions: Array<[Verb, string]> = [
        ['greaterOrEqual', intl.formatMessage(messages.greaterOrEqualDropdown)],
        ['lessOrEqual', intl.formatMessage(messages.lessOrEqualDropdown)],
        ['between', intl.formatMessage(messages.betweenDropdown)],
      ]

      return {
        label,
        renderFilterLabel: (
          statement?: Statement<QuantitySubject, QuantityFilterInput>
        ) => {
          if (statement?.verb === 'greaterOrEqual') {
            return intl.formatMessage(messages.greaterOrEqualLabel, {
              value: statement?.object?.min,
            })
          }

          if (statement?.verb === 'lessOrEqual') {
            return intl.formatMessage(messages.lessOrEqualLabel, {
              value: statement?.object?.max,
            })
          }

          if (statement?.verb === 'between') {
            return intl.formatMessage(messages.betweenLabel, {
              min: statement?.object?.min,
              max: statement?.object?.max,
            })
          }

          return intl.formatMessage(messages.all, {
            gender: labelGender,
          })
        },
        verbs: dropdownOptions.map(([option, title]) => ({
          label: title,
          value: option,
          object: (props: StatementProps<QuantityFilterInput>) => (
            <QuantityFilterPopup {...props} verb={option} />
          ),
        })),
      }
    },
    [intl]
  )

  const options = useMemo(
    () => ({
      quantity: createQuantityFilterOption({
        label: intl.formatMessage(columnsMessages.totalQuantity),
        labelGender: 'female',
      }),
      reservedQuantity: createQuantityFilterOption({
        label: intl.formatMessage(columnsMessages.reserved),
      }),
      availableQuantity: createQuantityFilterOption({
        label: intl.formatMessage(columnsMessages.available),
      }),
    }),
    [intl, createQuantityFilterOption]
  )

  const statements: Array<Statement<QuantitySubject, QuantityFilterInput>> = (
    Object.entries(filter) as Array<[QuantitySubject, QuantityFilterInput]>
  )
    .filter(([_, value]) => value?.min != null || value?.max != null)
    .map(([key, value]) => ({
      subject: key,
      verb:
        value?.min != null
          ? value?.max != null
            ? 'between'
            : 'greaterOrEqual'
          : 'lessOrEqual',
      error: null,
      object: value,
    }))

  function handleChange(
    statement: Statement<QuantitySubject, QuantityFilterInput>
  ) {
    // Can't pass null to setQuery because it will still put the property in
    // the url, but with an empty value
    const minQuery =
      (statement.verb === 'greaterOrEqual' || statement.verb === 'between') &&
      statement?.object?.min != null
        ? statement.object.min
        : undefined

    const maxQuery =
      (statement.verb === 'lessOrEqual' || statement.verb === 'between') &&
      statement?.object?.max != null
        ? statement.object.max
        : undefined

    const newQuery: Partial<FilterQuery> = {}

    if (statement.subject === 'quantity') {
      newQuery.minQuantity = minQuery
      newQuery.maxQuantity = maxQuery
    } else if (statement.subject === 'reservedQuantity') {
      newQuery.minReservedQuantity = minQuery
      newQuery.maxReservedQuantity = maxQuery
    } else if (statement.subject === 'availableQuantity') {
      newQuery.minAvailableQuantity = minQuery
      newQuery.maxAvailableQuantity = maxQuery
    }

    return newQuery
  }

  return {
    filter,
    statements,
    handleChange,
    options,
  }
}
