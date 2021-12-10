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
      }
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

  const onclickExport = () => {
    console.info('onclickExport')
    console.info('statements', statements)
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

              return `${
                st.verb === '=' ? is : isNot
              } ${st.object}`
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

// function StatusSelectorObject({ value, onChange }: any) {
//   const initialValue = {
//     'Window to cancelation': true,
//     Canceling: true,
//     Canceled: true,
//     'Payment pending': true,
//     'Payment approved': true,
//     'Ready for handling': true,
//     'Handling shipping': true,
//     'Ready for invoice': true,
//     Invoiced: true,
//     Complete: true,
//     ...(value || {}),
//   }

//   const toggleValueByKey = (key: any) => {
//     return {
//       ...(value || initialValue),
//       [key]: value ? !value[key] : false,
//     }
//   }

//   return (
//     <div>
//       {Object.keys(initialValue).map((opt, index) => {
//         return (
//           <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
//             <Checkbox
//               checked={value ? value[opt] : initialValue[opt]}
//               id={`status-${opt}`}
//               label={opt}
//               name="status-checkbox-group"
//               onChange={() => {
//                 const newValue = toggleValueByKey(`${opt}`)

//                 onChange(newValue)
//               }}
//               value={opt}
//             />
//           </div>
//         )
//       })}
//     </div>
//   )
// }

interface StatementObjectProps<T, U = SelectOption | null> {
  value: T
  onChange: (value: U) => void
  error?: ApolloError
  keepValueInput?: boolean
}
