import type { ApolloError } from 'apollo-client'

import withQuery from '../InfiniteSelect/withQuery'
import Select from './Select'
import categoriesQuery from '../../../graphql/categories.gql'

type Props = Omit<
  StatementObjectProps<Statement | null>,
  'onChange' | 'error'
> & {
  focused?: boolean
  testId?: string
  onClear?: () => void
  onSelect: (option: SelectOption) => void
  keepValueInput?: boolean
}

export default withQuery<Props>(Select)({
  query: categoriesQuery,
  resultName: 'categories',
})

export interface StatementObjectProps<T, U = SelectOption | null> {
  value: T
  onChange: (value: U) => void
  error?: ApolloError
  keepValueInput?: boolean
}
