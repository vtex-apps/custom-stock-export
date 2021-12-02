import classnames from 'classnames'
import { omit } from 'ramda'
import type { ForwardRefExoticComponent, PropsWithoutRef } from 'react'
import React, { forwardRef } from 'react'

export type Props = {
  roundedBottom?: boolean
  icon?: React.ReactNode
  searchTerm: string
  value: SelectOption
  selected: boolean
  key: string
  disabled?: boolean
  testId?: string
} & Omit<Partial<React.HTMLProps<HTMLButtonElement | HTMLDivElement>>, 'value'>

const Option: ForwardRefExoticComponent<PropsWithoutRef<Props>> = forwardRef<
  HTMLButtonElement,
  Props
>((props, ref) => {
  const {
    icon,
    selected,
    roundedBottom,
    searchTerm,
    disabled,
    testId,
    ...buttonProps
  } = props

  const value = props.value.label

  const renderOptionValue = (): string | React.ReactElement => {
    const index = value.toLowerCase().indexOf(searchTerm.toLowerCase())

    if (index === -1 || !searchTerm.length) {
      return value
    }

    const prefix = value.substring(0, index)
    const match = value.substr(index, searchTerm.length)
    const suffix = value.substring(index + match.length)

    return (
      <span className="truncate">
        <span className="fw7">{prefix}</span>
        {match}
        <span className="fw7">{suffix}</span>
      </span>
    )
  }

  const buttonClasses = classnames('bn w-100 tl pa4 f6', {
    'br2 br--bottom': roundedBottom,
    'bg-muted-5': selected,
    'c-disabled': disabled,
    'bg-base': !selected,
    pointer: !disabled,
  })

  return (
    <button
      {...omit(['value', 'key', 'type'], buttonProps)}
      ref={ref}
      type="button"
      disabled={disabled}
      className={buttonClasses}
      data-testid={testId}
    >
      <span className="h1 flex items-center">
        <span className="mr3 c-muted-2 flex pt1">{icon}</span>
        {disabled ? (
          <span className="truncate">{value}</span>
        ) : (
          renderOptionValue()
        )}
      </span>
    </button>
  )
})

export default Option
