import { defineMessages } from 'react-intl'

const prefix = 'admin/admin.app.custom-stock-export.'

export const titlesIntl = defineMessages({
  pageTitle: { id: `${prefix}pageTitle` },
  filterClear: { id: `${prefix}filterClear` },
  filterAll: { id: `${prefix}filterAll` },
  filterNone: { id: `${prefix}filterNone` },
  filterAny: { id: `${prefix}filterAny` },
  filterIs: { id: `${prefix}filterIs` },
  filterIsNot: { id: `${prefix}filterIsNot` },
  filterContains: { id: `${prefix}filterContains` },
  filterApply: { id: `${prefix}filterApply` },
  exportButton: { id: `${prefix}exportButton` },
})

export const filtersMessages = defineMessages({
  ok: { id: `${prefix}filters.ok` },
  all: { id: `${prefix}filters.all` },
  and: { id: `${prefix}filters.and` },
  greaterOrEqualDropdown: {
    id: `${prefix}filters.dropdown.greater-or-equal`,
  },
  greaterOrEqualLabel: {
    id: `${prefix}filters.label.greater-or-equal-value`,
  },
  lessOrEqualDropdown: {
    id: `${prefix}filters.dropdown.less-or-equal`,
  },
  lessOrEqualLabel: {
    id: `${prefix}filters.label.less-or-equal-value`,
  },
  betweenDropdown: {
    id: `${prefix}filters.dropdown.between`,
  },
  betweenLabel: {
    id: `${prefix}filters.label.between-values`,
  },
  betweenInvalid: {
    id: `${prefix}filters.error.between`,
  },
  maximumPlaceholder: {
    id: `${prefix}filters.placeholder.maximum`,
  },
  minimumPlaceholder: {
    id: `${prefix}filters.placeholder.minimum`,
  },
  search: {
    id: `${prefix}filters.search`,
  },
  warehousesQueryError: {
    id: `${prefix}filters.warehouses-query-error`,
  },
  warehousesNamesQueryError: {
    id: `${prefix}filters.warehouses-names-query-error`,
  },
})

export const commonMessages = defineMessages({
  inventory: { id: `admin/inventory` },
  retry: { id: `${prefix}commons.retry` },
  loading: {
    id: `${prefix}commons.loading`,
  },
  skuDoesntExist: { id: `${prefix}commons.sku-doesnt-exist` },
})

export const columnsMessages = defineMessages({
  products: { id: `${prefix}columns.products` },
  sku: { id: `${prefix}columns.sku` },
  lastUpdate: { id: `${prefix}columns.last-update` },
  reserved: { id: `${prefix}columns.reserved` },
  dispatchedReservations: {
    id: `${prefix}columns.dispatched-reservations`,
  },
  available: { id: `${prefix}columns.available` },
  infinite: { id: `${prefix}columns.infinite` },
  warehouse: { id: `${prefix}columns.warehouse` },
  updateCount: { id: `${prefix}columns.update-count` },
  infiniteInventory: { id: `${prefix}columns.infinite-inventory` },
  secondLoadingError: { id: `${prefix}columns.second-loading-error` },
  rowSaveError: { id: `${prefix}columns.row-save-error` },
  deleteInventoryItem: { id: `${prefix}columns.delete-item` },
  deleteInventoryItemSuccess: {
    id: `${prefix}columns.delete-item.success`,
  },
  deleteInventoryItemError: { id: `${prefix}columns.delete-item.error` },
})

export const tableMessages = defineMessages({
  of: { id: `${prefix}commons.table.of` },
  showRows: { id: `${prefix}commons.table.show-rows` },
})

export const productsTableMessages = defineMessages({
  itemsSearchDefault: {
    id: `${prefix}products-table.items-search-default`,
  },
  autocompleteSkuIsPrefix: {
    id: `${prefix}products-table.items-search.sku-prefix`,
  },
  autocompleteSkuIdIsPrefix: {
    id: `${prefix}products-table.items-search.sku-id-prefix`,
  },
  autocompleteProductIsPrefix: {
    id: `${prefix}products-table.items-search.product-prefix`,
  },
  autocompleteProductIdIsPrefix: {
    id: `${prefix}products-table.items-search.product-id-prefix`,
  },
  productsPageQueryError: {
    id: `${prefix}products-table.products-page-query-error`,
  },
  productsPageQueryErrorTitle: {
    id: `${prefix}products-table.products-page-query-error.title`,
  },
  noItemsFound: { id: `${prefix}products-table.no-items-found` },
  save: { id: `${prefix}products-table.save` },
  clearChanges: { id: `${prefix}products-table.clear-changes` },
  saveSuccess: { id: `${prefix}products-table.save-success` },
  saveError: { id: `${prefix}products-table.save-error` },
})

export const changelogMessages = defineMessages({
  changelog: { id: `${prefix}changelog.title` },
  productWarehouseNames: {
    id: `${prefix}changelog.product-warehouse-names`,
  },
  user: { id: `${prefix}changelog.user` },
  date: { id: `${prefix}changelog.date` },
  quantityBefore: { id: `${prefix}changelog.quantity-before` },
  quantityAfter: { id: `${prefix}changelog.quantity-after` },
  queryError: { id: `${prefix}changelog.query-error` },
  noEntries: { id: `${prefix}changelog.no-entries` },
})

export const reservedItemsMessages = defineMessages({
  reservedTitle: { id: `${prefix}reserved-items.title` },
  dispatchedTitle: { id: `${prefix}reserved-items.dispatched.title` },
  skuIdentification: {
    id: `${prefix}reserved-items.sku-identification`,
  },
  order: { id: `${prefix}reserved-items.order` },
  quantity: {
    id: `${prefix}reserved-items.quantity`,
  },
  reservationDate: { id: `${prefix}reserved-items.reservation-date` },
  expirationDate: { id: `${prefix}reserved-items.expiration-date` },
  status: { id: `${prefix}reserved-items.status` },
  confirmed: { id: `${prefix}reserved-items.status.confirmed` },
  authorized: { id: `${prefix}reserved-items.status.authorized` },
  canceled: { id: `${prefix}reserved-items.status.canceled` },
  expired: { id: `${prefix}reserved-items.status.expired` },
  action: { id: `${prefix}reserved-items.action` },
  seeOrder: { id: `${prefix}reserved-items.action.see-order` },
  queryError: { id: `${prefix}reserved-items.query-error` },
  noEntries: { id: `${prefix}reserved-items.no-entries` },
})

export const unsavedChangesMessages = defineMessages({
  modalTitle: {
    id: `${prefix}unsaved-changes.modal.title`,
  },
  modalDescription: {
    id: `${prefix}unsaved-changes.modal.description`,
  },
  saveChanges: {
    id: `${prefix}unsaved-changes.modal.save`,
  },
  ignoreChanges: {
    id: `${prefix}unsaved-changes.modal.ignore`,
  },
  cancel: {
    id: `${prefix}unsaved-changes.modal.cancel`,
  },
})
