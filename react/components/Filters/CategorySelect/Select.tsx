import type { FC } from 'react'
import React from 'react'
import { defineMessages } from 'react-intl'

import type { Props as InfiniteSelectProps } from '../InfiniteSelect'
import InfiniteSelect from '../InfiniteSelect'

const messages = defineMessages({
  loading: {
    id: 'admin/admin.app.custom-stock-export.filter.category.loading',
    defaultMessage: '',
  },
  placeholder: {
    id: 'admin/admin.app.custom-stock-export.filter.category.placeholder',
    defaultMessage: '',
  },
  error: {
    id: 'admin/admin.app.custom-stock-export.filter.category.error',
    defaultMessage: '',
  },
})

const Select: FC<Omit<InfiniteSelectProps, 'messages' | 'intl'>> = (props) => (
  <InfiniteSelect {...props} messages={messages} />
)

export default Select
