/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { pathOr } from 'ramda'
import { Input, /* Checkbox, */ FilterBar } from 'vtex.styleguide'
import type { ApolloError } from 'apollo-client'
import { useIntl } from 'react-intl'

import { useQuantityFilters } from '../../hooks/useQuantityFilters'
import { useWarehouseFilter } from '../../hooks/useWarehouseFilter'
import { filtersMessages } from '../../utils/intl'
import CategorySelect from './CategorySelect'

export default function Filters({ statements, setStatements }: any) {
  const intl = useIntl()

  const clear = intl.formatMessage(filtersMessages.clear)
  const all = intl.formatMessage(filtersMessages.all)
  const any = intl.formatMessage(filtersMessages.any)
  const is = intl.formatMessage(filtersMessages.is)
  const isNot = intl.formatMessage(filtersMessages.isNot)
  const contains = intl.formatMessage(filtersMessages.contains)
  const apply = intl.formatMessage(filtersMessages.apply)

  const quantityFilters = useQuantityFilters()
  const warehouseFilter = useWarehouseFilter()

  function simpleInputVerbs() {
    return [
      {
        label: is,
        value: '=',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
      {
        label: isNot,
        value: '!=',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
    ]
  }

  function simpleInputVerbsWithContains() {
    return [
      {
        label: is,
        value: '=',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
      {
        label: isNot,
        value: '!=',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
      {
        label: contains,
        value: 'contains',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
    ]
  }

  const filter = { ...warehouseFilter.filter, ...quantityFilters.filter }

  return (
    <div>
      <FilterBar
        alwaysVisibleFilters={[
          'categoryId',
          'productId',
          'productName',
          ...Object.keys(filter),
        ]}
        statements={statements}
        onChangeStatements={(s: any) => setStatements(s)}
        clearAllFiltersButtonLabel={clear}
        submitFilterLabel={apply}
        options={{
          categoryId: {
            label: intl.formatMessage(filtersMessages.category),
            renderFilterLabel: pathOr(all, ['object', 'label']),
            verbs: [
              {
                label: '',
                value: is,
                object: function VerbObject({
                  onChange,
                  value,
                  ...props
                }: StatementObjectProps<Statement | null>) {
                  return (
                    <CategorySelect
                      {...props}
                      onClear={() => {
                        value = null
                        onChange(null)
                      }}
                      value={value}
                      onSelect={onChange}
                      focused
                    />
                  )
                },
              },
            ],
          },
          productId: {
            label: intl.formatMessage(filtersMessages.productId),
            renderFilterLabel: (st: any) => {
              if (!st || !st.object) {
                // you should treat empty object cases only for alwaysVisibleFilters
                return any
              }

              return `${st.verb === '=' ? is : isNot} ${st.object}`
            },
            verbs: simpleInputVerbs(),
          },
          productName: {
            label: intl.formatMessage(filtersMessages.productName),
            renderFilterLabel: (st: any) => {
              if (!st || !st.object) {
                // you should treat empty object cases only for alwaysVisibleFilters
                return any
              }

              return `${
                st.verb === '=' ? is : st.verb === '!=' ? isNot : contains
              } ${st.object}`
            },
            verbs: simpleInputVerbsWithContains(),
          },
          ...warehouseFilter.options,
          ...quantityFilters.options,
        }}
      />
    </div>
  )
}

function SimpleInputObject({ value, onChange }: any) {
  return (
    <Input
      value={value || ''}
      onChange={(e: any) => onChange(e.target.value)}
    />
  )
}

interface StatementObjectProps<T, U = SelectOption | null> {
  value: T
  onChange: (value: U) => void
  error?: ApolloError
  keepValueInput?: boolean
}
