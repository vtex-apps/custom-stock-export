import type { ApolloQueryResult, ApolloError } from 'apollo-client'
import type { DocumentNode } from 'graphql'
import { pathOr } from 'ramda'
import type { ComponentType } from 'react'
import React, { useRef, useEffect } from 'react'
import type { QueryResult } from 'react-apollo'
import { Query } from 'react-apollo'

import type {
  Pagination,
  PaginatedData,
  SetPagination,
} from '../../../utils/pagination'
import { usePagination } from '../../../utils/pagination'

export interface StatementObjectProps<T, U = SelectOption | null> {
  value: T
  onChange: (value: U) => void
  error?: ApolloError
  keepValueInput?: boolean
}

export interface SelectItem {
  id: string
  name: string
}

interface Data<T> {
  [key: string]: PaginatedData<T>
}

type Variables = Pagination

export type QueryProps<T> = Omit<
  QueryResult<Data<T>, Variables>,
  'fetchMore'
> & {
  resultName: string
  pagination: Pagination
  setPagination: SetPagination
  fetchMore: () => Promise<ApolloQueryResult<Data<T>>>
}

type ComponentProps<T> = T & Partial<StatementObjectProps<Statement | null>>

interface Props {
  query: DocumentNode
  resultName: string
}

const withQuery =
  <T, QData = SelectItem>(
    WrappedComponent: ComponentType<T & QueryProps<QData>>
  ) =>
  ({ query, resultName }: Props) =>
  (props: ComponentProps<T>) => {
    const [pagination, setPagination] = usePagination({
      page: 1,
      pageSize: 15,
      searchKey: pathOr('', ['value', 'label'], props),
    })

    return (
      <Query<Data<QData>, Variables>
        query={query}
        variables={pagination}
        notifyOnNetworkStatusChange
      >
        {({ fetchMore, variables, ...data }) => {
          // Apparently this workaround is needed :/
          const variablesRef = useRef(variables)

          useEffect(() => {
            variablesRef.current = pagination
          }, [])

          const handleFetchMore = () =>
            fetchMore({
              variables: {
                ...variablesRef.current,
                page: variablesRef.current.page + 1,
              },
              updateQuery: (
                prev,
                { fetchMoreResult, variables: newVariables }
              ) => {
                const getItems = pathOr<QData[]>([], [resultName, 'items'])

                variablesRef.current = newVariables ?? variablesRef.current

                return (
                  prev && {
                    ...prev,
                    [resultName]: {
                      ...prev[resultName],
                      items: getItems(prev).concat(getItems(fetchMoreResult)),
                      ...(fetchMoreResult?.resultName?.paging && {
                        paging: fetchMoreResult.resultName.paging,
                      }),
                    },
                  }
                )
              },
            })

          return (
            <WrappedComponent
              {...props}
              {...data}
              resultName={resultName}
              variables={variables}
              fetchMore={handleFetchMore}
              pagination={pagination}
              setPagination={setPagination}
            />
          )
        }}
      </Query>
    )
  }

export default withQuery
