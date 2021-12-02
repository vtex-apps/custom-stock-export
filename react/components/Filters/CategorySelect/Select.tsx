import type { FC } from 'react'
import React from 'react'

import { filtersMessages } from '../../../utils/intl'
import type { Props as InfiniteSelectProps } from '../InfiniteSelect'
import InfiniteSelect from '../InfiniteSelect'

const messages = {
  loading: filtersMessages.loading,
  placeholder: filtersMessages.placeholder,
  error: filtersMessages.error,
}

const Select: FC<Omit<InfiniteSelectProps, 'messages' | 'intl'>> = (props) => (
  <InfiniteSelect {...props} messages={messages} />
)

export default Select
