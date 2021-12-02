/* eslint-disable no-shadow */
import type { ApolloQueryResult } from 'apollo-client'
import { useEffect, useState, useRef } from 'react'
import type { QueryResult } from 'react-apollo'

type UsePolling<TData, TVariables> = Pick<
  QueryResult<TData, TVariables>,
  'loading' | 'error' | 'variables' | 'networkStatus'
> & {
  pollingLimit: number
  pollingMs: number
  tryAgain: (variables?: TVariables) => Promise<ApolloQueryResult<TData>>
}

export const APOLLO_STATUS = {
  LOADING: 1,
  REFETCHING: 4,
  POLLING: 5,
}

export const POLLING = {
  LIMIT: 5,
  MS: 200,
}

export const usePolling = <TData, TVariables>({
  loading: queryLoading,
  error: queryError,
  networkStatus,
  variables,
  tryAgain,
  pollingLimit,
}: UsePolling<TData, TVariables>) => {
  const [error, setError] = useState(queryError)
  const [loading, setLoading] = useState(queryLoading)
  const [attempts, setAttempts] = useState(1)
  const refetchPromise = useRef<Promise<ApolloQueryResult<TData>> | null>(null)

  const status = {
    loading,
    error,
  }

  const refetch = () => {
    if (!refetchPromise.current) {
      setLoading(true)
      refetchPromise.current = tryAgain(variables)
        .then((result) => {
          setError(undefined)
          setAttempts(1)

          return result
        })
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .catch((error) => {
          setError(error)
          setAttempts(attempts + 1)

          return error
        })
        .finally(() => {
          refetchPromise.current = null
          setLoading(false)
        })
    }

    return refetchPromise.current
  }

  useEffect(() => {
    if (!loading) {
      if (error) {
        if (attempts < pollingLimit) {
          refetch()
        }
      } else if (attempts > 1) {
        setAttempts(1)
      }
    }
  }, [loading, error, attempts])

  useEffect(() => {
    setLoading(networkStatus < 7)
  }, [networkStatus])

  useEffect(() => {
    setError(queryError)
  }, [queryError])

  return {
    reset: () => {
      setAttempts(1)
    },
    failed: attempts >= pollingLimit,
    status,
  }
}
