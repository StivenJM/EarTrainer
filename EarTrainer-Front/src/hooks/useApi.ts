import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Dispatch, UnknownAction } from "@reduxjs/toolkit"
import { ApiResponse } from "../services/api.service"

type Data<T> = T | null
type CustomError = Error | null

type UseApiOptions<P> = {
    params?: P
    autoFetch?: boolean
}

interface UseApiResult<T, P> {
    loading: boolean
    data: Data<T>
    error: CustomError
    fetch: ((param: P) => void) | (() => void)
    fetchGlobal: ((reduxCallback: (data: T) => UnknownAction, param: P) => void) | ((reduxCallback: (data: T) => UnknownAction) => void)
}

export const useApi = <T, P, D extends Dispatch<UnknownAction> = Dispatch<UnknownAction>>(apiCall: ((param: P) => ApiResponse<T>) | (() => ApiResponse<T>), options?: UseApiOptions<P>): UseApiResult<T, P> => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Data<T>>(null)
    const [error, setError] = useState<CustomError>(null)
    const apiDispatch = useDispatch<D>()

    const fetch = useCallback((param: P) => {
        const { call, controller } = apiCall(param)
        setLoading(true)

        call.then((response) => {
            setData(response.data)
            setError(null)
        }).catch((err) => {
            setError(err)
        }).finally(() => {
            setLoading(false)
        })
        return () => controller.abort()
    }, [apiCall])

    const fetchGlobal = useCallback((reduxCallback: (data: T) => UnknownAction, param: P) => {
        const { call, controller } = apiCall(param)
        setLoading(true)

        call.then((response) => {
            apiDispatch(reduxCallback(response.data))
            setData(response.data)
            setError(null)
        }).catch((err) => {
            setError(err)
        }).finally(() => {
            setLoading(false)
        })
        return () => controller.abort()
    }, [apiCall])

    useEffect(() => {
        if (options?.autoFetch && options.params) {
            return fetch(options.params)
        }
    }, [fetch, options?.autoFetch, options?.params])

return { loading, data, error, fetch, fetchGlobal }
}