import classNames from 'classnames'
import React, { forwardRef, useRef, useState } from 'react'
import { IconClear, IconCaretDown, Spinner } from 'vtex.styleguide'

import styles from '../styles.css'

type Props = {
  value: string
  loading: boolean
  onClear: () => void
  onChange: (term: string) => void
  testId?: string
} & Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'>

const SearchInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    onClear,
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    loading,
    testId,
    ...inputProps
  } = props

  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  const handleClear = () => {
    onClear?.()
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    onBlur?.(e)
  }

  const handleCaretClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const inputClasses = classNames(
    `w-100 ma0 border-box bw1 br2 ba outline-0 t-body h-regular ph5 pr8 t-small`,
    {
      'bg-disabled b--disabled c-disabled': disabled,
      'bg-base c-on-base': !disabled,
      [`b--blue ${styles['border-medium']}`]: focused,
      'b--muted-3': !disabled && !focused,
      [styles['select-input']]: !disabled && !focused,
    }
  )

  const iconClasses = classNames('flex items-center', {
    'bg-transparent b--disabled c-disabled': disabled,
    'c-link': !disabled,
  })

  return (
    <div className="flex flex-row">
      <div data-testid={testId} className="relative w-100">
        <input
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref.current = node
            }
          }}
          className={inputClasses}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          {...inputProps}
        />
        <span
          className="absolute fw5 flex items-center ph4 t-body top-0 right-0 h-100 pointer"
          onClick={handleCaretClick}
          role="presentation"
        >
          {onClear && value && (
            <span
              className="c-muted-3 mr3 flex items-center"
              onClick={handleClear}
              role="button"
              tabIndex={0}
            >
              <IconClear />
            </span>
          )}
          <span className={iconClasses}>
            {loading ? <Spinner size={14} /> : <IconCaretDown size={9} />}
          </span>
        </span>
      </div>
    </div>
  )
})

export default SearchInput
