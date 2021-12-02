import classNames from 'classnames'
import React, { useState, useRef, useEffect } from 'react'
import { useIntl, defineMessages } from 'react-intl'

import useClickOutside from '../../../hooks/useClickOutside'
import useArrowNavigation from '../../../hooks/useArrowNavigation'
import type { Props as OptionProps } from './Option'
import Option from './Option'
import SelectInput from './SelectInput'
import styles from './styles.css'
import { filtersMessages } from '../../../utils/intl'

const messages = defineMessages({
  noOptionsFound: filtersMessages.noOptionsFound,
})

interface InputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  onClear: () => void
  onChange: (term: string) => void
  value: string
  loading: boolean
}

interface OptionsProps {
  renderOption?: (props: OptionProps, index: number) => React.ReactNode
  value: SelectOption[]
  icon?: React.ReactElement
  onSelect: (option: SelectOption) => void
  onPopoverOpened?: (popover: HTMLDivElement | null) => void
  onPopoverClosed?: () => void
  keepValueInput?: boolean
}

export interface Props {
  input: InputProps
  options: OptionsProps
  testId?: string
}

type OptionRef = HTMLElement | null

const NO_SELECTED_OPTION_INDEX = 0

const FilterSelect: React.FC<Props> = ({
  input: { value, onClear, onChange, loading, ref, ...inputProps },
  options: {
    onSelect,
    value: options,
    renderOption,
    icon,
    onPopoverOpened,
    onPopoverClosed,
    keepValueInput,
  },
  testId,
}) => {
  const [term, setTerm] = useState(value || '')
  const [showPopover, setShowPopover] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const optionsRefs = useRef<OptionRef[]>([])
  const { formatMessage } = useIntl()

  const handleClear = () => {
    setShowPopover(false)
    setTerm('')
    onClear()
  }

  useEffect(() => {
    if (!keepValueInput && term) {
      handleClear()
      setShowPopover(true)
    }
  }, [])

  const [selectedOptionIndex, setSelectedOptionIndex] = useArrowNavigation(
    containerRef,
    options.length,
    NO_SELECTED_OPTION_INDEX
  )

  useClickOutside(containerRef, () => setShowPopover(false))

  const popoverOpened = showPopover

  useEffect(() => {
    if (popoverOpened && onPopoverOpened) {
      onPopoverOpened(popoverRef.current)
    } else if (!popoverOpened && onPopoverClosed) {
      onPopoverClosed()
    }
  }, [popoverOpened])

  useEffect(() => {
    const optionRef = optionsRefs.current[selectedOptionIndex]

    if (optionRef) {
      optionRef.focus()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [selectedOptionIndex])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return
    }

    const selectedOption = options[selectedOptionIndex]

    setTerm(selectedOption.label)
    onSelect(selectedOption)
    setSelectedOptionIndex(NO_SELECTED_OPTION_INDEX)
    setShowPopover(false)
  }

  const handleTermChange = (newTerm = '') => {
    if (!showPopover) {
      setShowPopover(true)
    }

    setTerm(newTerm)
    if (onChange) {
      onChange(newTerm)
    }
  }

  const handleOptionClick = (option: SelectOption) => {
    setTerm(option.label)
    onSelect(option)
    setShowPopover(false)
  }

  const getOptionProps = (option: SelectOption, index: number) => ({
    key: `${option.label}-${option.value}-${index}`,
    selected: index === selectedOptionIndex,
    value: option,
    searchTerm: term,
    roundedBottom: index === options.length - 1,
    icon: typeof option !== 'string' && icon ? icon : null,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ref: (ref: HTMLElement | null) => {
      optionsRefs.current[index] = ref
    },
    onFocus: () => {
      setSelectedOptionIndex(index)
    },
    onMouseEnter: () => {
      setSelectedOptionIndex(index)
    },
    onClick: () => {
      handleOptionClick(option)
    },
  })

  const renderOptions = (): React.ReactElement | React.ReactElement[] => (
    <div className="flex flex-column">
      {options.length > 0
        ? options.map(
            renderOption
              ? (option, index) =>
                  renderOption(getOptionProps(option, index), index)
              : (option, index) => <Option {...getOptionProps(option, index)} />
          )
        : !inputProps.disabled && (
            <Option
              key="disabled-option"
              searchTerm={term}
              roundedBottom
              selected={false}
              testId="filter-no-results-option"
              disabled
              value={{
                value: '',
                label: formatMessage(messages.noOptionsFound),
              }}
            />
          )}
    </div>
  )

  const popoverClasses = classNames(
    styles.popover,
    'absolute w-100 overflow-y-auto z-1',
    {
      'br br2 ba b--muted-3 bg-base shadow-5': popoverOpened,
    }
  )

  return (
    <div ref={containerRef} className="flex flex-column w-100">
      <SelectInput
        testId={testId}
        {...inputProps}
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
        value={term}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowPopover(true)}
        onClear={handleClear}
        onChange={handleTermChange}
        loading={loading}
      />
      <div className="relative">
        <div ref={popoverRef} className={popoverClasses}>
          {popoverOpened ? renderOptions() : null}
        </div>
      </div>
    </div>
  )
}

export default FilterSelect
