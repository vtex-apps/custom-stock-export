/* eslint-disable vtex/prefer-early-return */
import classnames from 'classnames'
import type { ForwardRefExoticComponent } from 'react'
import React, { useEffect, useRef, forwardRef } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { IconWarning, Button } from 'vtex.styleguide'

export type Props = {
  filterInput: HTMLInputElement | null
  roundedBottom?: boolean
  icon?: React.ReactNode
  searchTerm: string
  value: SelectOption
  selected: boolean
  key: string
} & Pick<React.HTMLProps<HTMLButtonElement>, 'onClick'>

export interface SelectOption {
  value: string
  label: string
}

const messages = defineMessages({
  tryAgain: {
    id: 'admin/admin.app.custom-stock-export.filter.try-again',
    defaultMessage: '',
  },
})

const ErrorOption: ForwardRefExoticComponent<Props> = forwardRef<
  HTMLDivElement,
  Props
>((props, ref) => {
  const { roundedBottom, value: optionValue, onClick, filterInput } = props
  const value = optionValue.label

  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const containerClasses = classnames('w-100 tl pa4 f6 bt b--muted-4 bg-base', {
    'br2 br--bottom': roundedBottom,
  })

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus()
      if (filterInput) {
        filterInput.focus()
      }
    }
  }, [filterInput])

  return (
    <div ref={ref} className={containerClasses}>
      <div className="ph2 pt2">
        <span className="flex t-mini c-muted-1 pb3">
          <span className="mr3 flex c-warning">
            <IconWarning />
          </span>
          <span className="w-100">{value}</span>
        </span>
        <Button
          ref={buttonRef}
          onClick={onClick}
          size="small"
          variation="tertiary"
          block
        >
          <FormattedMessage {...messages.tryAgain} />
        </Button>
      </div>
    </div>
  )
})

export default ErrorOption
