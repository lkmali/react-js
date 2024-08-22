/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { env } from '../config'
import { setCacheFilter } from '../helper'
const CancelToken = axios.CancelToken
let cancel: any
const axiosInstance = axios.create({
  baseURL: env.REACT_APP_BACKEND_BASE_URL,
})

// axiosInstance.CancelToken = axios.CancelToken;

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (cancel && config.url.match(/\/users/g, '')) {
      cancel() // cancel request
    }
    config.cancelToken = new CancelToken(function executor(c) {
      cancel = c
    })
    // here do the interceptor work
    const token = localStorage.getItem('token')
    /**
     * Registering a user and login does not require a bearer token
     */
    if (token && !(config.method === 'put' && !config.url.replace(/account\/user/g, ''))) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_err) => {
    // console.err(err)
  },
)

axiosInstance.interceptors.response.use(
  (res) => {
    // console.log("res",)
    const data = res?.data?.data ?? []
    const totalCount = res?.data?.count ?? 0
    setCacheFilter(res.request.responseURL, totalCount, data)
    return res
  },
  (error) => {
    if (error && error.response && error.response.data && error.response.data.message) {
      return Promise.reject({ message: error.response.data.message, status: error.response.status })
    } else {
      // TODO: Will handle it gracefully once backend work is done!
      const { failedValidation, message } = error
      if (failedValidation) {
        return Promise.reject({ message: message })
      } else if (error?.status === 500) {
        return Promise.reject({ message: message })
      } else if (error.code === 'ERR_CANCELED') {
        return Promise.resolve({ status: 499, data: [] })
      } else {
        return Promise.reject({ message: message })
      }
    }
  },
)

// export function GET(url: string, config = {}) {
//   return axiosInstance.get(url, config)
// }

// export function POST(url: string, data: any, config = {}) {
//   return axiosInstance.post(url, data, config)
// }

// export function PUT(url: string, data: any) {
//   return axiosInstance.put(url, data)
// }

// export function DELETE(url: string, data: any, config = {}) {
//   return axiosInstance({ url, ...config, method: 'delete', data })
// }

// export function PATCH(url: string, data: any, config = {}) {
//   return axiosInstance.patch(url, data, config)
// }

const restActions = {
  GET: (url: string, config = {} as any, isWorkFLow = false) => {
    if (isWorkFLow) {
      config['baseURL'] = env.REACT_APP_WORKFLOW_BASE_URL
    }
    return axiosInstance.get(url, config)
  },
  POST: (url: string, data: any, config = {} as any, isWorkFLow = false) => {
    if (isWorkFLow) {
      config['baseURL'] = env.REACT_APP_WORKFLOW_BASE_URL
    }
    return axiosInstance.post(url, data, config)
  },
  PUT: (url: string, data: any, config = {} as any, isWorkFLow = false) => {
    if (isWorkFLow) {
      config['baseURL'] = env.REACT_APP_WORKFLOW_BASE_URL
    }
    return axiosInstance.put(url, data, config)
  },
  DELETE: (url: string, data: any, config = {} as any, isWorkFLow = false) => {
    if (isWorkFLow) {
      config['baseURL'] = env.REACT_APP_WORKFLOW_BASE_URL
    }
    return axiosInstance({ url, ...config, method: 'delete', data })
  },
  PATCH: (url: string, data: any, config = {} as any, isWorkFLow = false) => {
    if (isWorkFLow) {
      config['baseURL'] = env.REACT_APP_WORKFLOW_BASE_URL
    }
    return axiosInstance.patch(url, data, config)
  },
}

export default restActions
