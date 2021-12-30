/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { pathOr } from 'ramda'
import {
  Input,
  /* Checkbox, */ FilterBar,
  ButtonWithIcon,
} from 'vtex.styleguide'
import Download from '@vtex/styleguide/lib/icon/Download'
import type { ApolloError } from 'apollo-client'
import { useIntl } from 'react-intl'

import { useQuantityFilters } from '../../hooks/useQuantityFilters'
import { useWarehouseFilter } from '../../hooks/useWarehouseFilter'
import { filtersMessages, appMessages } from '../../utils/intl'
import CategorySelect from './CategorySelect'

export default function Filters() {
  const [statements, setStatements] = useState([])
  const intl = useIntl()

  const clear = intl.formatMessage(filtersMessages.clear)
  const all = intl.formatMessage(filtersMessages.all)
  const any = intl.formatMessage(filtersMessages.any)
  const is = intl.formatMessage(filtersMessages.is)
  const isNot = intl.formatMessage(filtersMessages.isNot)
  const contains = intl.formatMessage(filtersMessages.contains)
  const apply = intl.formatMessage(filtersMessages.apply)
  const exportIcon = <Download />

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

  const onclickExport = async () => {
    let json: ExportBodyType = {}

    statements.forEach((statement: any) => {
      if (statement.subject === 'categoryId') {
        json.categoryId = statement.object.value
      }

      if (statement.subject === 'productId') {
        json.productId = { value: statement.object, operator: statement.verb }
      }

      if (statement.subject === 'productName') {
        json.productId = { value: statement.object, operator: statement.verb }
      }

      if (statement.subject === 'warehouseIds') {
        const warehouseIds = []
        for (let [key, _value] of statement.object.entries()) {
          warehouseIds.push(key)
        }
        json.warehouseIds = warehouseIds
      }

      if (statement.subject === 'quantity') {
        json.quantity = {
          min: statement.object.min,
          max: statement.object.max,
          operator: statement.verb,
        }
      }

      if (statement.subject === 'reservedQuantity') {
        json.quantity = {
          min: statement.object.min,
          max: statement.object.max,
          operator: statement.verb,
        }
      }

      if (statement.subject === 'availableQuantity') {
        json.quantity = {
          min: statement.object.min,
          max: statement.object.max,
          operator: statement.verb,
        }
      }
    })
    console.log('json', json)
    const response = await fetch('/v1/stock/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })
    console.info('response', response)
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
            label: 'Category',
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
            label: 'Product ID',
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
            label: 'Product Name',
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
      <ButtonWithIcon icon={exportIcon} onClick={onclickExport}>
        {`${intl.formatMessage(appMessages.exportButton)}`}
      </ButtonWithIcon>
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

interface ExportBodyType {
  categoryId?: number
  productId?: ProductFilterType
  productName?: ProductFilterType
  warehouseIds?: string[]
  quantity?: QuantityFilterType
  reservedQuantity?: QuantityFilterType
  availableQuantity?: QuantityFilterType
}

interface ProductFilterType {
  value: string
  operator: string
}

interface QuantityFilterType {
  min: number
  max: number
  operator: string
}
