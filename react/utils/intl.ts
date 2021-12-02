import { defineMessages } from 'react-intl'

const prefix = 'admin/admin.app.custom-stock-export.'
const prefixFilters = 'admin/admin.app.custom-stock-export.filters.'

export const appMessages = defineMessages({
  pageTitle: { id: `${prefix}pageTitle` },
  exportButton: { id: `${prefix}exportButton` },
})

export const filtersMessages = defineMessages({
  clear: { id: `${prefixFilters}clear` },
  all: { id: `${prefixFilters}all` },
  none: { id: `${prefixFilters}none` },
  any: { id: `${prefixFilters}any` },
  is: { id: `${prefixFilters}is` },
  isNot: { id: `${prefixFilters}isNot` },
  contains: { id: `${prefixFilters}contains` },
  apply: { id: `${prefixFilters}apply` },
  loading: { id: `${prefixFilters}category.loading` },
  placeholder: { id: `${prefixFilters}category.placeholder` },
  error: { id: `${prefixFilters}category.error` },
  ok: { id: `${prefixFilters}ok` },
  and: { id: `${prefixFilters}and` },
  noOptionsFound: { id: `${prefixFilters}noOptionsFound` },
  tryAgain: { id: `${prefixFilters}tryAgain` },
  greaterOrEqualDropdown: { id: `${prefixFilters}dropdown.greater-or-equal` },
  greaterOrEqualLabel: { id: `${prefixFilters}label.greater-or-equal-value` },
  lessOrEqualDropdown: { id: `${prefixFilters}dropdown.less-or-equal` },
  lessOrEqualLabel: { id: `${prefixFilters}label.less-or-equal-value` },
  betweenDropdown: { id: `${prefixFilters}dropdown.between` },
  betweenLabel: { id: `${prefixFilters}label.between-values` },
  betweenInvalid: { id: `${prefixFilters}error.between` },
  maximumPlaceholder: { id: `${prefixFilters}placeholder.maximum` },
  minimumPlaceholder: { id: `${prefixFilters}placeholder.minimum` },
  search: { id: `${prefixFilters}search` },
  warehousesQueryError: { id: `${prefixFilters}warehouses-query-error` },
  warehousesNamesQueryError: {
    id: `${prefixFilters}warehouses-names-query-error`,
  },
})

export const commonMessages = defineMessages({
  loading: { id: `${prefix}commons.loading` },
})

export const columnsMessages = defineMessages({
  lastUpdate: { id: `${prefix}columns.last-update` },
  reserved: { id: `${prefix}columns.reserved` },
  available: { id: `${prefix}columns.available` },
  warehouse: { id: `${prefix}columns.warehouse` },
})
