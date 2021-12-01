/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { pathOr } from 'ramda'
import { Input, Checkbox, FilterBar } from 'vtex.styleguide'
import type { ApolloError } from 'apollo-client'
import { useIntl } from 'react-intl'

import { titlesIntl } from '../../utils/intl'
import CategorySelect from './CategorySelect'

export default function Filters() {
  const [statements, setStatements] = useState([])
  const intl = useIntl()

  const filterClear = intl.formatMessage(titlesIntl.filterClear)
  const filterAll = intl.formatMessage(titlesIntl.filterAll)
  const filterNone = intl.formatMessage(titlesIntl.filterNone)
  const filterAny = intl.formatMessage(titlesIntl.filterAny)
  const filterIs = intl.formatMessage(titlesIntl.filterIs)
  const filterIsNot = intl.formatMessage(titlesIntl.filterIsNot)
  const filterContains = intl.formatMessage(titlesIntl.filterContains)
  const filterApply = intl.formatMessage(titlesIntl.filterApply)

  function simpleInputVerbs() {
    return [
      {
        label: filterIs,
        value: '=',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
      {
        label: filterIsNot,
        value: '!=',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
      {
        label: filterContains,
        value: 'contains',
        object: (props: any) => <SimpleInputObject {...props} />,
      },
    ]
  }

  return (
    <FilterBar
      alwaysVisibleFilters={[
        'categoryId',
        'productId',
        'productName',
        'email',
        'status',
      ]}
      statements={statements}
      onChangeStatements={(s: any) => setStatements(s)}
      clearAllFiltersButtonLabel={filterClear}
      submitFilterLabel={filterApply}
      options={{
        categoryId: {
          label: 'Category',
          renderFilterLabel: pathOr(filterAll, ['object', 'label']),
          verbs: [
            {
              label: '',
              value: filterIs,
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
              return filterAny
            }

            return `${
              st.verb === '='
                ? filterIs
                : st.verb === '!='
                ? filterIsNot
                : filterContains
            } ${st.object}`
          },
          verbs: simpleInputVerbs(),
        },
        productName: {
          label: 'Product Name',
          renderFilterLabel: (st: any) => {
            if (!st || !st.object) {
              // you should treat empty object cases only for alwaysVisibleFilters
              return filterAny
            }

            return `${
              st.verb === '='
                ? filterIs
                : st.verb === '!='
                ? filterIsNot
                : filterContains
            } ${st.object}`
          },
          verbs: simpleInputVerbs(),
        },
        email: {
          label: 'Email',
          renderFilterLabel: (st: any) => {
            if (!st || !st.object) {
              // you should treat empty object cases only for alwaysVisibleFilters
              return filterAny
            }

            return `${
              st.verb === '='
                ? filterIs
                : st.verb === '!='
                ? filterIsNot
                : filterContains
            } ${st.object}`
          },
          verbs: simpleInputVerbs(),
        },
        status: {
          label: 'Status',
          renderFilterLabel: (st: any) => {
            if (!st || !st.object) {
              // you should treat empty object cases only for alwaysVisibleFilters
              return filterAll
            }

            const keys: any = st.object ? Object.keys(st.object) : {}
            const isAllTrue = !keys.some((key: any) => !st.object[key])
            const isAllFalse = !keys.some((key: any) => st.object[key])
            const trueKeys = keys.filter((key: any) => st.object[key])
            let trueKeysLabel = ''

            trueKeys.forEach((key: any, index: number) => {
              trueKeysLabel += `${key}${
                index === trueKeys.length - 1 ? '' : ', '
              }`
            })

            return `${
              isAllTrue
                ? filterAll
                : isAllFalse
                ? filterNone
                : `${trueKeysLabel}`
            }`
          },
          verbs: [
            {
              label: 'includes',
              value: 'includes',
              object: (props: any) => <StatusSelectorObject {...props} />,
            },
          ],
        },

        utm: {
          label: 'UTM Source',
          renderFilterLabel: (st: any) =>
            `${st.verb === '=' ? filterIs : filterContains} ${st.object}`,
          verbs: simpleInputVerbs(),
        },
        seller: {
          label: 'Seller',
          renderFilterLabel: (st: any) =>
            `${st.verb === '=' ? filterIs : filterContains} ${st.object}`,
          verbs: simpleInputVerbs(),
        },
      }}
    />
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

function StatusSelectorObject({ value, onChange }: any) {
  const initialValue = {
    'Window to cancelation': true,
    Canceling: true,
    Canceled: true,
    'Payment pending': true,
    'Payment approved': true,
    'Ready for handling': true,
    'Handling shipping': true,
    'Ready for invoice': true,
    Invoiced: true,
    Complete: true,
    ...(value || {}),
  }

  const toggleValueByKey = (key: any) => {
    return {
      ...(value || initialValue),
      [key]: value ? !value[key] : false,
    }
  }

  return (
    <div>
      {Object.keys(initialValue).map((opt, index) => {
        return (
          <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
            <Checkbox
              checked={value ? value[opt] : initialValue[opt]}
              id={`status-${opt}`}
              label={opt}
              name="status-checkbox-group"
              onChange={() => {
                const newValue = toggleValueByKey(`${opt}`)

                onChange(newValue)
              }}
              value={opt}
            />
          </div>
        )
      })}
    </div>
  )
}

interface StatementObjectProps<T, U = SelectOption | null> {
  value: T
  onChange: (value: U) => void
  error?: ApolloError
  keepValueInput?: boolean
}
