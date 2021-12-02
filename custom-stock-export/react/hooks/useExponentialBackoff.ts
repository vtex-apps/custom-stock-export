import { useState, useEffect, useCallback, useRef } from 'react'
import type { ApolloError } from 'apollo-client'
import type Maybe from 'graphql/tsutils/Maybe'

const INITIAL_DELAY = 200
const MAX_DELAY = 5_000
const COEFFICIENT = 2

export function useExponentialBackoff({
  queryLoading,
  queryError,
  refetch,
}: {
  queryLoading: boolean
  queryError: Maybe<ApolloError>
  refetch: () => void
}) {
  const [loading, setLoading] = useState(queryLoading)
  const [error, setError] = useState<Maybe<ApolloError>>(queryError)
  const [retryCount, setRetryCount] = useState(0)
  const [waitingTimeout, setWaitingTimeout] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerId: any = useRef(0)

  const stopBackoff = useCallback(() => {
    setLoading(false)
    setError(null)
    setRetryCount(0)
    clearTimeout(timerId.current)
    setWaitingTimeout(false)
  }, [setLoading, setError, setRetryCount, timerId])

  useEffect(() => {
    if (loading && !queryLoading) {
      if (!queryError) {
        stopBackoff()
      } else if (!waitingTimeout) {
        setError(queryError)
        setWaitingTimeout(true)
        timerId.current = setTimeout(() => {
          setWaitingTimeout(false)
          refetch()
          setRetryCount((prevRetryCount) => prevRetryCount + 1)
        }, Math.min(MAX_DELAY, INITIAL_DELAY * COEFFICIENT ** retryCount))
      }
    } else if (!loading && queryLoading) {
      setLoading(true)
    }

    // Effect should only be called when query state changes. Tried
    // doing it with useQuery's onCompleted and onError but there were
    // too many edge cases.
  }, [queryLoading])

  return { loading, error, stopBackoff }
}
