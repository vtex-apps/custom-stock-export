import type { FC, ChangeEvent } from 'react'
import React, { useState } from 'react'
import { IconClear, IconSearch } from 'vtex.styleguide'
import classNames from 'classnames'

import styles from './styles.css'

const ICON_SIZE = 14

interface Props {
  value: string
  placeholder: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  onSubmit: () => void
}

const CustomInputSearch: FC<Props> = (props) => {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={classNames('w-100 h-small flex items-center bb bw1', {
        'b--muted-2': focused,
        'b--muted-4 hover-b--muted-3': !focused,
      })}
    >
      <span className="flex flex-none c-muted-2 mr3">
        <IconSearch size={ICON_SIZE} />
      </span>
      <input
        className={`bn outline-0 c-on-base bg-base w-100 ${styles.input} ${styles.hideDecorators} ${styles.noAppearance}`}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onKeyUp={(e) => e.key === 'Enter' && props.onSubmit()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type="search"
      />
      {props.value && (
        <button
          onClick={props.onClear}
          className="flex flex-none mr3 pointer c-muted-3 br4 pa0 bn outline-transparent bg-base"
        >
          <IconClear size={ICON_SIZE} />
        </button>
      )}
    </div>
  )
}

export default CustomInputSearch
