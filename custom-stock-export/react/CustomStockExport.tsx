import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
// import { useVtexLogger } from 'vtexarg.vtex-logger-react'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'
export default function CustomStockExport() {
  const intl = useIntl()
  /*const objTest = {
    id: '1',
    name: 'test react',
    description: 'test react',
    price: '1',
    quantity: '1',
    sku: '1',
    barcode: '1',
    brand: '1',
    category: '1',
  }*/
  //const { useLog } = useVtexLogger()

  /*const handleClick = async () =>{
    const message = 'testReact'
    try {
      await useLog({ message: message, detail: objTest })
    } catch (error) {
      console.error(error)
    }
  }*/
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title={intl.formatMessage(appMessages.pageTitle)} />
      }
    >
      <PageBlock variation="full">
        <Filters />
      </PageBlock>
    </Layout>
  )
}
