import React, { useEffect, useState } from 'react'
import {
  Layout,
  PageHeader,
  PageBlock,
  ButtonWithIcon,
  Alert,
} from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'
import ColumnsSelect from './components/Columns/ColumnsSelect'
import Download from '@vtex/styleguide/lib/icon/Download'
import { disableColumns } from './components/Columns/columns'
import { useFullSession } from 'vtex.session-client'

const exportIcon = <Download />

export default function CustomStockExport() {
  const { data } = useFullSession()

  const [statements, setStatements] = useState([])
  const [columns, setColumns] = useState<string[]>(disableColumns)
  const [email, setEmail] = useState('')
  const [isLoadingExport, setIsLoadingExport] = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  const [exportMessageType, setExportMessageType] = useState('')
  const [urlCsv, setUrlCsv] = useState('')
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
    json.email = email
    console.log('json', json)
    setIsLoadingExport(true)
    setExportMessageType('warning')
    setExportMessage(intl.formatMessage(appMessages.exportInProcess))
    setUrlCsv('')
    const response = await fetch('/v1/stock/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })
    setIsLoadingExport(false)
    if (response.status === 200) {
      setExportMessageType('success')
      setExportMessage(intl.formatMessage(appMessages.exportSuccess))
      const responseJson = await response.json()
      setUrlCsv(responseJson.urlCsv)
    } else {
      setExportMessageType('error')
      setExportMessage(intl.formatMessage(appMessages.exportError))
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
    for (let i = 0; i < 2; i++) {
      const classOfElem =
        't-body lh-copy c-muted-1 mb7 ml3 w-two-thirds-ns w-100'
      document?.getElementsByClassName(classOfElem)[0]?.classList.add('mb4')
      document?.getElementsByClassName(classOfElem)[0]?.classList.remove('mb7')
    }
  }, [])

  useEffect(() => {
    if (exportMessage || isLoadingExport || urlCsv) {
      document.querySelectorAll('[role="alert"]').forEach(function (el) {
        el.classList.add('pv2')
        el.classList.remove('pv4')
      })
    }
  }, [exportMessage, isLoadingExport, urlCsv])

  useEffect(() => {
    if (data?.session && !email) {
      const session: any = data.session
      const adminUserEmail =
        session.namespaces.authentication.adminUserEmail.value
      setEmail(adminUserEmail)
    }
  }, [data])
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
        <div className="flex">
          <ButtonWithIcon
            icon={exportIcon}
            onClick={onclickExport}
            isLoading={isLoadingExport}
          >
            {`${intl.formatMessage(appMessages.exportButton)}`}
          </ButtonWithIcon>
          {((isLoadingExport || exportMessage) && !urlCsv) && (
            <div className="ml5">
              <Alert type={exportMessageType}>
                {exportMessage}
              </Alert>
            </div>
          )}
          {((isLoadingExport || exportMessage) && urlCsv) && (
            <div className="ml5">
              <Alert type={exportMessageType}>
                {exportMessage}&nbsp;
                <a href={urlCsv}>{`${intl.formatMessage(
                  appMessages.here
                )}`}</a>
                {'.'}
              </Alert>
            </div>
          )}
        </div>
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
  email?: string
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
