import React from 'react'
import { Layout, PageHeader, PageBlock, Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'

import { useLoggerVtex } from 'vtex.vtex-logger-react'

export default function CustomStockExport() {
  const { useLog } = useLoggerVtex()

  const intl = useIntl()
  const objTest = {
    id: '1',
    name: 'Test Name',
    description: 'Test Description',
    price: '100',
    quantity: '1',
    brand: 'Test Brand',
    category: 'Test Category',
  }

  const handleClick = async () =>{
    const appName = 'my-app'
    const message = 'Test log'
    try {
      const response = await useLog({ app: appName, message: message, detail: objTest })
      console.log('response', response)
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
        <Button onClick={handleClick}>
          Log
        </Button>
      </PageBlock>
    </Layout>
  )
}
