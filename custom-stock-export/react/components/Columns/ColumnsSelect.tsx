import { Checkbox } from 'vtex.styleguide'
import React from 'react'

import { disableColumns, allColumns, allColumnsLabels } from './columns'
import '../../style/Columns.global.css'

interface ColumnsSelectProps {
  columns: string[]
  setColumns: (columns: string[]) => void
}

export default function ColumnsSelect({
  columns,
  setColumns,
}: ColumnsSelectProps) {
  const onChangeCheckbox = (column: string) => {
    setColumns(
      columns.includes(column)
        ? columns.filter((c) => c !== column)
        : [...columns, column]
    )
  }

  return (
    <div className="columns-container">
      {allColumns.map((column, index) => (
        <Checkbox
          key={column}
          checked={columns.includes(column)}
          id={column}
          label={allColumnsLabels[index]}
          name="default-checkbox-group"
          onChange={() => onChangeCheckbox(column)}
          disabled={disableColumns.includes(column)}
        />
      ))}
    </div>
  )
}
