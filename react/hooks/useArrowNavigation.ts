/* eslint-disable vtex/prefer-early-return */
import { useState, useEffect } from 'react'

export default function useArrowNavigation(
  ref: React.RefObject<HTMLElement> | null,
  optionsLength: number,
  initialSelectedOptionIndex: number
): [number, (index: number) => void] {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    initialSelectedOptionIndex
  )

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      ref?.current &&
      e.target instanceof Node &&
      ref.current.contains(e.target)
    ) {
      let index

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          index = Math.max(selectedOptionIndex - 1, initialSelectedOptionIndex)

          return setSelectedOptionIndex(index)

        case 'ArrowDown':
          e.preventDefault()
          index = Math.min(selectedOptionIndex + 1, optionsLength - 1)

          return setSelectedOptionIndex(index)

        default:
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return [selectedOptionIndex, setSelectedOptionIndex]
}
