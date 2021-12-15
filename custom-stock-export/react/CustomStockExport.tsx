import React from 'react'
import { Layout, PageHeader, PageBlock, Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'

import { useLoggerVtex as useLoggerVtexApp } from 'vtexarg.vtex-logger-react'

export default function CustomStockExport() {
  const { useLoggerVtex } = useLoggerVtexApp
  const { useLog } = useLoggerVtex()

  const intl = useIntl()
  const objTest = {
    id: '1',
    name: 'test react',
    description: 'test react',
    price: '1',
    quantity: '1',
    sku: '1',
    barcode: '1',
    brand: '1',
    category: '1',
  }

  const handleClick = async () =>{
    const message = 'testReact'
    try {
      await useLog({ message: message, detail: objTest })
    } catch (error) {
      console.error(error)
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
        <Filters />
        <Button onClick={handleClick}/>
      </PageBlock>
    </Layout>
  )
}
