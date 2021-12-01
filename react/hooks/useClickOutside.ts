import { useEffect } from 'react'

export default function useClickOutside(
  ref: React.RefObject<HTMLElement> | null,
  onClickOutside: (e: Event) => void
) {
  const handleClickOutside = (e: Event) => {
    if (
      ref?.current &&
      e.target instanceof Node &&
      !ref.current.contains(e.target)
    ) {
      onClickOutside(e)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
}
