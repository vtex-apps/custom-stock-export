import { Checkbox } from 'vtex.styleguide'
import React from 'react'

interface ColumnsSelectProps {
  columns: string[]
  setColumns: (columns: string[]) => void
}

export default function ColumnsSelect({
  columns,
  setColumns,
}: ColumnsSelectProps) {
  const allColumns = [
    'ProductId',
    'ProductName',
    'Id',
    'SkuName',
    'warehouseId',
    'warehouseName',
    'totalQuantity',
    'reservedQuantity',
    'availableQuantity',
    'test',
  ]
  const disableColumns = [
    'ProductId',
    'ProductName',
    'Id',
    'SkuName',
    'warehouseId',
    'warehouseName',
    'totalQuantity',
    'reservedQuantity',
    'availableQuantity',
  ]
  const onChangeCheckbox = (column: string) => {
    setColumns(columns.includes(column) ? columns.filter(c => c !== column) : [...columns, column])
  }
  return (
    <div className="checkbox-container">
      {allColumns.map((column) => (
        <Checkbox
        key={column}
        checked={columns.includes(column)}
        id={column}
        label={column}
        name="default-checkbox-group"
        onChange={() => onChangeCheckbox(column)}
        disabled={disableColumns.includes(column)}
      />
      ))}
      
    </div>
  )
}
