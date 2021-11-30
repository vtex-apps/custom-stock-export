import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import { titlesIntl } from './utils/intl'
import LoadingSpinner from './components/LoadingSpinner'

export default function CustomStockExport() {
  const intl = useIntl()
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title={intl.formatMessage(titlesIntl.pageTitle)} />
      }
    >
      <PageBlock variation="full">
        {`Test`}
        <LoadingSpinner />
      </PageBlock>
    </Layout>
  )
}
