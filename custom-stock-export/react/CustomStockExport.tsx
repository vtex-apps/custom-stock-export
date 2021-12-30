import React, { useState } from 'react'
import { Layout, PageHeader, PageBlock, ButtonWithIcon } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'
import Download from '@vtex/styleguide/lib/icon/Download'

const exportIcon = <Download />

export default function CustomStockExport() {
  const [statements, setStatements] = useState([])

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
        ></PageBlock>
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
