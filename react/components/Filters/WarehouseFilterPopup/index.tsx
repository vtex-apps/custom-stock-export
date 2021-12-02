import type { FC } from 'react'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery } from 'react-apollo'
import { useIntl, FormattedMessage } from 'react-intl'
import { Checkbox, Spinner, IconWarning } from 'vtex.styleguide'
import { useDebouncedSearch } from 'vtex.logistics-carrier-commons'
import type { QueryWarehousesArgs } from 'vtex.logistics-carrier-graphql'
import classNames from 'classnames'
import type { ApolloError } from 'apollo-client'

import type { StatementProps } from '../../../hooks/useProductFilters'
import type { QueriedWarehouse, QueriedWarehousesPage } from '../../../types'
import type { WarehousesMap } from '../../../hooks/useWarehouseFilter'
import { useExponentialBackoff } from '../../../hooks/useExponentialBackoff'
import { filtersMessages as messages } from '../../../utils/intl'
import styles from './styles.css'
import CustomInputSearch from '../CustomInputSearch'
import WAREHOUSES from '../../../graphql/warehouses.graphql'

type Props = StatementProps<WarehousesMap>

const INITIAL_PAGE = 1
const PER_PAGE = 7
const SPINNER_SIZE = 24

const WarehouseFilterPopup: FC<Props> = ({ value: checked, onChange }) => {
  const intl = useIntl()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showTopBorder, setShowTopBorder] = useState(false)

  const [keyword, setKeyword] = useState('')
  const { term, handleSearchChange, handleSearchClear, handleSearchSubmit } =
    useDebouncedSearch({
      term: keyword,
      onChange: ({ keyword: k }) => setKeyword(k),
    })

  const {
    loading: firstQueryLoading,
    error: firstQueryError,
    data,
    refetch,
    fetchMore: queryFetchMore,
  } = useQuery<{ warehouses: QueriedWarehousesPage }, QueryWarehousesArgs>(
    WAREHOUSES,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        page: INITIAL_PAGE,
        perPage: PER_PAGE,
        keyword,
      },
    }
  )

  const [fetchingMore, setFetchingMore] = useState<{
    loading: boolean
    error: ApolloError | null
  }>({ loading: false, error: null })

  const fetchMore = useCallback(() => {
    setFetchingMore({ loading: true, error: null })
    queryFetchMore({
      variables: {
        page: data?.warehouses?.paging
          ? data.warehouses.paging.page + 1
          : INITIAL_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev
        }

        return {
          warehouses: {
            ...fetchMoreResult.warehouses,
            items: [
              ...prev.warehouses.items,
              ...fetchMoreResult.warehouses.items,
            ],
          },
        }
      },
    })
      .catch((error) => setFetchingMore({ loading: false, error }))
      .finally(() =>
        setFetchingMore((prevFetchingMore) => ({
          loading: false,
          error: prevFetchingMore.error,
        }))
      )
  }, [setFetchingMore, queryFetchMore, data])

  const {
    loading: queryLoading,
    error,
    stopBackoff,
  } = useExponentialBackoff({
    queryLoading: firstQueryLoading || fetchingMore.loading,
    queryError: firstQueryError ?? fetchingMore.error,
    refetch: () => {
      if (firstQueryError) {
        refetch()
      } else if (fetchingMore.error) {
        fetchMore()
      }
    },
  })

  // Need this to keep previously checked warehouses at the top,
  // and recently checked ones where they are
  const [checkedOnTop, setCheckedOnTop] = useState(checked)

  useEffect(() => {
    setCheckedOnTop(checked)
    stopBackoff()
    setFetchingMore({ loading: false, error: null })
  }, [term])

  const searchLoading =
    term !== keyword ||
    ((firstQueryLoading || firstQueryError) &&
      !fetchingMore.loading &&
      !fetchingMore.error)

  const loading = searchLoading ?? queryLoading

  const hasMorePages =
    searchLoading ||
    (data?.warehouses?.paging &&
      data.warehouses.paging.page < data.warehouses.paging.pages)

  const checkboxRenderer = (warehouse: QueriedWarehouse) => (
    <div className="h2 mw5 nl6 ph6 nr2 flex items-center" key={warehouse.id}>
      <Checkbox
        checked={checked?.has(warehouse.id)}
        id={warehouse.id}
        onChange={() => {
          const newValue = new Map(checked ?? [])

          if (checked?.has(warehouse.id)) {
            newValue.delete(warehouse.id)
          } else {
            newValue.set(warehouse.id, warehouse.name)
          }

          onChange(newValue)
        }}
      />
      <label htmlFor={warehouse.id} className="w-100">
        <div className="pl3 truncate pointer">{warehouse.name}</div>
      </label>
    </div>
  )

  const handleScroll = () => {
    const reachedLoadingPoint =
      containerRef?.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >
        containerRef.current.scrollHeight - SPINNER_SIZE

    if (containerRef?.current?.scrollTop && !showTopBorder) {
      setShowTopBorder(true)
    } else if (!containerRef?.current?.scrollTop && showTopBorder) {
      setShowTopBorder(false)
    }

    if (!loading && hasMorePages && reachedLoadingPoint) {
      fetchMore()
    }
  }

  return (
    <>
      <CustomInputSearch
        value={term}
        onChange={handleSearchChange}
        onClear={() => {
          containerRef.current?.scrollTo({ top: 0 })
          handleSearchClear()
        }}
        placeholder={intl.formatMessage(messages.search)}
        onSubmit={handleSearchSubmit}
      />
      <div
        className={classNames(
          'overflow-y-auto overflow-x-hidden mt6 pb3 nh6 ph6 nb4 bb bw1 b--light-gray',
          styles.scrollShadow,
          { bt: showTopBorder }
        )}
        style={{ maxHeight: '14.25rem' }} // Height of 7 items + borders
        ref={containerRef}
        onScroll={handleScroll}
      >
        {checkedOnTop &&
          Array.from(checkedOnTop, ([id, name]) =>
            checkboxRenderer({ id, name })
          )}
        {!searchLoading &&
          data?.warehouses?.items
            ?.filter((warehouse) => !checkedOnTop?.has(warehouse.id))
            ?.map(checkboxRenderer)}
        {hasMorePages && (
          <div className="h2 flex items-center justify-center">
            <Spinner size={SPINNER_SIZE} />
          </div>
        )}
        {/* Check for hasMorePages to avoid frame where data has loaded but
            error hasn't been updated so it would appear */}
        {hasMorePages && error && (
          <div className="flex mt3 pt5 pb3 nh6 ph6 bt b--light-gray bw1">
            <span className="c-warning mr3">
              <IconWarning />
            </span>
            <span className="lh-solid">
              <FormattedMessage {...messages.warehousesQueryError} />
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default WarehouseFilterPopup
