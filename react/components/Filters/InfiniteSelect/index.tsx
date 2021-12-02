/* eslint-disable no-shadow */
/* eslint-disable vtex/prefer-early-return */
import type { ApolloError } from 'apollo-client'
import debounce from 'lodash.debounce'
import { pathOr } from 'ramda'
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { useIntl } from 'react-intl'

import FilterSelect from '../FilterSelect'
import Option from '../FilterSelect/Option'
import type { QueryProps, SelectItem } from './withQuery'
import { usePolling, POLLING } from './hooks'
import type { Props as ErrorOptionProps } from './ErrorOption'
import ErrorOption from './ErrorOption'
import type { Pagination, PaginatedData } from '../../../utils/pagination'

export type Props<T = SelectItem> = QueryProps<T> & {
  focused?: boolean
  value: Statement | null
  onClear?: () => void
  keepValueInput?: boolean
  onSelect: (option: SelectOption) => void
  messages: { [key: string]: { id: string } }
  testId?: string
}

interface Data<T> {
  [queryName: string]: undefined | PaginatedData<T>
}

const DEBOUNCE = 500

const Select = <T extends SelectItem = SelectItem>({
  messages,
  loading: queryLoading,
  data,
  resultName,
  error: queryError,
  fetchMore,
  refetch,
  networkStatus,
  variables,
  pagination,
  setPagination,
  onClear,
  onSelect,
  focused,
  keepValueInput,
  testId,
}: Props<T>) => {
  const { formatMessage } = useIntl()
  const [readyToFilter, setReadyToFilter] = useState(false)
  const [preventLoading, setPreventLoading] = useState(false)
  const [fetchMoreError, setFetchMoreError] = useState<ApolloError | undefined>(
    undefined
  )

  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLSpanElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fetchingMore = useRef(false)

  const {
    reset,
    failed,
    status: pollingStatus,
  } = usePolling<Data<T>, Pagination>({
    loading: queryLoading,
    error: queryError ?? fetchMoreError,
    tryAgain: data?.[resultName] ? fetchMore : refetch,
    variables,
    networkStatus,
    pollingMs: POLLING.MS,
    pollingLimit: POLLING.LIMIT,
  })

  // Clear the fetchMoreError when it's done
  useEffect(() => {
    if (
      data?.[resultName] &&
      fetchMoreError &&
      !pollingStatus.error &&
      !pollingStatus.loading
    ) {
      setFetchMoreError(undefined)
    }
  }, [data, fetchMoreError, pollingStatus, resultName])

  const error = queryError ?? pollingStatus.error
  const loading = queryLoading || pollingStatus.loading || (error && !failed)

  const canFetchMore =
    pathOr(0, [resultName, 'paging', 'page'], data) <
    pathOr(0, [resultName, 'paging', 'pages'], data)

  const showLoading = loading ?? canFetchMore

  const options = pathOr<T[]>([], [resultName, 'items'], data)
    .map((item) => ({
      value: item.id,
      label: item.name,
    }))
    .concat(
      showLoading || error
        ? [
            {
              value: '',
              label: formatMessage(failed ? messages.error : messages.loading),
            },
          ]
        : []
    )

  const handleIntersection = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (
        entry.isIntersecting &&
        options.length > 1 &&
        !loading &&
        !fetchingMore.current &&
        !fetchMoreError
      ) {
        observer.disconnect()
        fetchingMore.current = true
        fetchMore()
          .catch(setFetchMoreError)
          .finally(() => {
            fetchingMore.current = false
          })
      }
    },
    [fetchMore, fetchMoreError, loading, options.length]
  )

  const handleChange = useMemo(
    () =>
      debounce((searchKey: string) => {
        setPagination({ searchKey, page: 1 })
      }, DEBOUNCE),
    [setPagination]
  )

  const connectObserver = useCallback(
    (popover: HTMLDivElement | null) => {
      popoverRef.current = popover
      if (popover && loadingRef.current) {
        observer.current = new IntersectionObserver(handleIntersection, {
          root: popover,
          threshold: 0.3,
        })
        observer.current.observe(loadingRef.current)
      }
    },
    [handleIntersection]
  )

  const disconnectObserver = () => {
    if (observer.current) {
      observer.current.disconnect()
    }
  }

  useEffect(() => {
    if (!loading) {
      // Reset states
      setPreventLoading(false)
      setReadyToFilter(false)
      // Need this to correctly detect infinite scroll after filtering
      disconnectObserver()
      if (popoverRef.current) {
        connectObserver(popoverRef.current)
      }
    }
  }, [loading, popoverRef, loadingRef, connectObserver])

  useEffect(() => {
    if (inputRef.current && focused) {
      inputRef.current.focus()
    }
  }, [focused])

  return (
    <FilterSelect
      testId={testId}
      input={{
        ref: inputRef,
        value: pagination.searchKey,
        onClear: () => {
          setPagination({ searchKey: '' })
          if (onClear) {
            onClear()
          }
        },
        onChange: (term: string) => {
          setReadyToFilter(term !== pagination.searchKey)
          handleChange(term)
        },
        loading: !preventLoading && (loading || readyToFilter),
        placeholder: formatMessage(messages.placeholder),
      }}
      options={{
        value: options,
        onSelect: (option: SelectOption) => {
          setPreventLoading(true)
          setPagination({ searchKey: option.label })
          onSelect(option)
        },
        onPopoverOpened: connectObserver,
        onPopoverClosed: () => {
          disconnectObserver()
          popoverRef.current = null
        },
        keepValueInput,
        renderOption: function Renderer(props, index) {
          if (index !== options.length - 1 || (!showLoading && !error)) {
            return <Option {...props} />
          }

          if (showLoading && !failed) {
            return (
              <div key={props.key} className="pa4">
                <span ref={loadingRef} className="i c-muted-3 f6 ml3">
                  {props.value.label}
                </span>
              </div>
            )
          }

          return (
            <ErrorOption
              {...(props as ErrorOptionProps)}
              onClick={() => {
                reset()
                if (inputRef.current) {
                  inputRef.current.focus()
                }
              }}
              filterInput={inputRef.current}
            />
          )
        },
      }}
    />
  )
}

export default Select
