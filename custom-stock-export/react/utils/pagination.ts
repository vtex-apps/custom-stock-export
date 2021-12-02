/* eslint-disable vtex/prefer-early-return */
import { useState, useEffect } from 'react'
import { uniq, path } from 'ramda'

import { getTermFromOption } from './autocomplete'

export interface PaginatedData<T> {
  items: T[]
  paging: Paging
}

export interface Paging {
  page: number
  perPage: number
  pages: number
  total: number
}

export interface Pagination {
  page: number
  pageSize: number
  searchKey: string
}

export type SetPagination = (pagination: Partial<Pagination>) => void

export const usePagination = (
  initialState: Pagination = { page: 1, pageSize: 5, searchKey: '' }
): [Pagination, SetPagination] => {
  const [state, setState] = useState(initialState)

  return [
    state,
    (partialState: Partial<Pagination>) =>
      setState({ ...state, ...partialState }),
  ]
}

interface UpdatePageArgs {
  oldPageSize: number
  pageSize: number
  from: number
  to: number
}

export const newPage = ({
  oldPageSize,
  pageSize,
  from,
  to,
}: UpdatePageArgs) => {
  return pageSize < oldPageSize
    ? Math.ceil(Math.max(from / pageSize, 1))
    : Math.ceil(Math.max(to / pageSize, 1))
}

/**
 * This function takes the Autocomplete options and only the unique options
 * will be structured. The options that appears multiple times will be turned into
 * a simple string so the term can be searched before going into the Collection page.
 */
const processAutocompleteOptions = (options: AutocompleteOption[]) => {
  const occurrences = options.reduce<{ [k: string]: number }>(
    (acc, option) => ({
      ...acc,
      [getTermFromOption(option)]: (acc[getTermFromOption(option)] || 0) + 1,
    }),
    {}
  )

  return options.map((option) =>
    occurrences[getTermFromOption(option)] > 1
      ? getTermFromOption(option)
      : option
  )
}

export interface OptionsFetchMore {
  options: AutocompleteOption[]
  canFetchMore: boolean
}

export interface Data {
  items: Item[]
  paging: Paging
}

interface Item {
  id: Record<string, unknown>
  name: string
}

export interface OptionsSource {
  data: Data
  pagination: Pagination
  loading: boolean
}
export type SetOptions = (options: AutocompleteOption[]) => void
export type SetCanFetchMore = (canFetch: boolean) => void

export interface PaginatedOptions {
  options: AutocompleteOption[]
  setOptions: SetOptions
  canFetchMore: boolean
  setCanFetchMore: SetCanFetchMore
}

export const usePaginatedOptions = (
  sourceState: OptionsSource,
  initialState: OptionsFetchMore = { options: [], canFetchMore: false }
): PaginatedOptions => {
  const { pagination, data, loading } = sourceState
  const [options, setOptions] = useState(initialState.options)
  const [canFetchMore, setCanFetchMore] = useState(initialState.canFetchMore)

  useEffect(() => {
    if (!loading && path(['items'], data)) {
      const fetchedOptions = data.items.map(
        ({ id, name }: Item): AutocompleteOption => ({
          label: name,
          value: id,
        })
      )

      if (pagination.page === 1) {
        setOptions(uniq(processAutocompleteOptions(fetchedOptions)))
      } else {
        setOptions(
          uniq(processAutocompleteOptions(options.concat(fetchedOptions)))
        )
      }

      setCanFetchMore(data.paging?.pages > pagination.page)
    }
  }, [loading, data, pagination.searchKey, pagination.page])

  return {
    options,
    setOptions,
    canFetchMore,
    setCanFetchMore,
  }
}
