import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { appMessages } from './utils/intl'
import Filters from './components/Filters'

export default function CustomStockExport() {

  const intl = useIntl()
  
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
