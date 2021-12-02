import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Input } from 'vtex.styleguide'
import type { QuantityFilterInput } from 'vtex.inventory-graphql'

import type { StatementProps, Verb } from '../../../hooks/useProductFilters'
import { filtersMessages as messages } from '../../../utils/intl'
import { isInteger, convertInteger } from '../../../utils/inputs'

type Props = StatementProps<QuantityFilterInput> & { verb: Verb }

const QuantityFilterPopup: FC<Props> = ({ verb, value, onChange }) => {
  const intl = useIntl()
  const showMinInput = verb === 'greaterOrEqual' || verb === 'between'
  const showMaxInput = verb === 'lessOrEqual' || verb === 'between'
  const [quantity, setQuantity] = useState(value)
  // In order to allow negative numbers
  const [minInputValue, setMinInputValue] = useState<string | null>(null)
  const [maxInputValue, setMaxInputValue] = useState<string | null>(null)
  const validQuantity =
    verb !== 'between'
      ? quantity?.min != null || quantity?.max != null
      : quantity?.min != null &&
        quantity?.max != null &&
        quantity.min <= quantity.max

  useEffect(() => {
    function updateStatement() {
      if (validQuantity) {
        onChange(quantity)
      } else {
        // Disable "OK" button
        onChange(null)
      }
    }

    updateStatement()
    // Should not update when `onChange` updates
  }, [quantity, validQuantity])

  useEffect(() => {
    function updateStatementByVerb() {
      if (verb === 'greaterOrEqual') {
        setMaxInputValue(null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setQuantity((prevQuantity: any) =>
          prevQuantity?.min == null
            ? null
            : {
                min: prevQuantity?.min,
                max: null,
              }
        )
      } else if (verb === 'lessOrEqual') {
        setMinInputValue(null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setQuantity((prevQuantity: any) =>
          prevQuantity?.max == null
            ? null
            : {
                min: null,
                max: prevQuantity?.max,
              }
        )
      }
    }

    updateStatementByVerb()
  }, [verb])

  function handleMinChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isInteger(event.target.value)) {
      return
    }

    setMinInputValue(event.target.value)
    setQuantity({
      ...quantity,
      min: convertInteger(event.target.value),
    })
  }

  function handleMaxChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isInteger(event.target.value)) {
      return
    }

    setMaxInputValue(event.target.value)
    setQuantity({
      ...quantity,
      max: convertInteger(event.target.value),
    })
  }

  return (
    <>
      {showMinInput && (
        <Input
          placeholder={intl.formatMessage(messages.minimumPlaceholder)}
          value={minInputValue ?? quantity?.min ?? ''}
          onChange={handleMinChange}
        />
      )}
      {showMinInput && showMaxInput && (
        <div className="mv3 ml5 pl1">
          <FormattedMessage {...messages.and} />
        </div>
      )}
      {showMaxInput && (
        <Input
          placeholder={intl.formatMessage(messages.maximumPlaceholder)}
          value={maxInputValue ?? quantity?.max ?? ''}
          onChange={handleMaxChange}
          errorMessage={
            !validQuantity &&
            quantity?.min != null &&
            quantity?.max != null &&
            intl.formatMessage(messages.betweenInvalid)
          }
        />
      )}
    </>
  )
}

export default QuantityFilterPopup
