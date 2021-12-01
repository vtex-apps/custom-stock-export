/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { pathOr } from 'ramda'
import { Input, Checkbox, FilterBar } from 'vtex.styleguide'
import type { ApolloError } from 'apollo-client'

import CategorySelect from './CategorySelect'

export default function Filters() {
  const [statements, setStatements] = useState([])

  return (
    <FilterBar
      alwaysVisibleFilters={['categoryId', 'id', 'email', 'status']}
      statements={statements}
      onChangeStatements={(s: any) => setStatements(s)}
      clearAllFiltersButtonLabel="Clear Filters"
      options={{
        categoryId: {
          label: 'Category',
          renderFilterLabel: pathOr(`All`, ['object', 'label']),
          verbs: [
            {
              label: '',
              value: 'is',
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
        id: {
          label: 'Order ID',
          renderFilterLabel: (st: any) => {
            if (!st || !st.object) {
              // you should treat empty object cases only for alwaysVisibleFilters
              return 'Any'
            }

            return `${
              st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'
            } ${st.object}`
          },
          verbs: simpleInputVerbs(),
        },
        email: {
          label: 'Email',
          renderFilterLabel: (st: any) => {
            if (!st || !st.object) {
              // you should treat empty object cases only for alwaysVisibleFilters
              return 'Any'
            }

            return `${
              st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains '
            } ${st.object}`
          },
          verbs: simpleInputVerbs(),
        },
        status: {
          label: 'Status',
          renderFilterLabel: (st: any) => {
            if (!st || !st.object) {
              // you should treat empty object cases only for alwaysVisibleFilters
              return 'All'
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
              isAllTrue ? 'All' : isAllFalse ? 'None' : `${trueKeysLabel}`
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
            `${st.verb === '=' ? 'is' : 'contains'} ${st.object}`,
          verbs: simpleInputVerbs(),
        },
        seller: {
          label: 'Seller',
          renderFilterLabel: (st: any) =>
            `${st.verb === '=' ? 'is' : 'contains'} ${st.object}`,
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

function simpleInputVerbs() {
  return [
    {
      label: 'is',
      value: '=',
      object: (props: any) => <SimpleInputObject {...props} />,
    },
    {
      label: 'is not',
      value: '!=',
      object: (props: any) => <SimpleInputObject {...props} />,
    },
    {
      label: 'contains',
      value: 'contains',
      object: (props: any) => <SimpleInputObject {...props} />,
    },
  ]
}

interface StatementObjectProps<T, U = SelectOption | null> {
  value: T
  onChange: (value: U) => void
  error?: ApolloError
  keepValueInput?: boolean
}
