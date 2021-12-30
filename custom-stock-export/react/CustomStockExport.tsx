import React, { useEffect, useState } from 'react'
import { Layout, PageHeader, PageBlock, ButtonWithIcon } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'
import ColumnsSelect from './components/Columns/ColumnsSelect'
import Download from '@vtex/styleguide/lib/icon/Download'
import { disableColumns } from './components/Columns/columns'

const exportIcon = <Download />

export default function CustomStockExport() {
  const [statements, setStatements] = useState([])
  const [columns, setColumns] = useState<string[]>(disableColumns)

  const intl = useIntl()
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
    json.columns = columns
    console.log('json', json)
    const response = await fetch('/v1/stock/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })
    if (response.status === 200) {
    }
  }
  useEffect(() => {
    const boxes = document.querySelectorAll('.styleguide__box')

    ;[].forEach.call(
      boxes,
      function fixBox(box: {
        classList: {
          remove: (arg0: string) => void
          add: (arg0: string) => void
        }
      }) {
        box.classList.remove('pa7')
        box.classList.add('pa3')
      }
    )
    document
      ?.getElementsByClassName(
        't-body lh-copy c-muted-1 mb7 ml3 w-two-thirds-ns w-100'
      )[0]
      ?.classList.add('mb4')
    document
      ?.getElementsByClassName(
        't-body lh-copy c-muted-1 mb7 ml3 w-two-thirds-ns w-100'
      )[0]
      ?.classList.remove('mb7')
    document
      ?.getElementsByClassName(
        't-body lh-copy c-muted-1 mb7 ml3 w-two-thirds-ns w-100'
      )[0]
      ?.classList.add('mb4')
    document
      ?.getElementsByClassName(
        't-body lh-copy c-muted-1 mb7 ml3 w-two-thirds-ns w-100'
      )[0]
      ?.classList.remove('mb7')
  }, [])
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title={intl.formatMessage(appMessages.pageTitle)} />
      }
    >
      <PageBlock variation="full">
        <PageBlock
          title={`${intl.formatMessage(appMessages.filters)}`}
          variation="full"
          subtitle={`${intl.formatMessage(appMessages.filtersHelp)}`}
        >
          <Filters statements={statements} setStatements={setStatements} />
        </PageBlock>
        <PageBlock
          title={`${intl.formatMessage(appMessages.columns)}`}
          variation="full"
          subtitle={`${intl.formatMessage(appMessages.columnsHelp)}`}
        >
          <ColumnsSelect columns={columns} setColumns={setColumns} />
        </PageBlock>
        <ButtonWithIcon icon={exportIcon} onClick={onclickExport}>
          {`${intl.formatMessage(appMessages.exportButton)}`}
        </ButtonWithIcon>
      </PageBlock>
    </Layout>
  )
}

interface ExportBodyType {
  categoryId?: number
  productId?: ProductFilterType
  productName?: ProductFilterType
  warehouseIds?: string[]
  quantity?: QuantityFilterType
  reservedQuantity?: QuantityFilterType
  availableQuantity?: QuantityFilterType
  columns?: string[]
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
