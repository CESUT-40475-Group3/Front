import { Times, TOKEN_KEY } from '@nobitex/utils/constants.js'
import ky, { HTTPError, KyInstance, TimeoutError, Options } from 'ky'
import { isBrowser } from '@nobitex/utils/helpers/general.js'
import Cookies from 'js-cookie'
import axios, { Axios, AxiosProgressEvent } from 'axios'

export const cacheControlForPublicAPIs = isBrowser()
  ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
  : 'max-age=7200'

const defaultContentKyInstance: KyInstance = ky.extend({
  headers: {
    Accept: 'application/json',
    'Cache-Control': cacheControlForPublicAPIs,
  },
  retry: {
    limit: 2,
    methods: ['get', 'head', 'trace'],
    statusCodes: [408, 413, 500, 502, 503, 504, 521, 522, 524],
    maxRetryAfter: undefined,
    delay: attemptCount => 0.3 * 2 ** (attemptCount - 1) * 1000,
  },
  timeout: 30 * Times.SECOND,
  throwHttpErrors: true,
})

const defaultJsonKyInstance: KyInstance = defaultContentKyInstance.extend({
  headers: {
    'Content-Type': 'application/json',
  },
})

function getToken(): string {
  const storedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  return storedToken ? `Token ${storedToken}` : ''
}

const publicKy: KyInstance = defaultJsonKyInstance

const cdnKy: KyInstance = ky.create({
  timeout: 30 * Times.SECOND,
  throwHttpErrors: true,
})

const authorizedKy: KyInstance = defaultJsonKyInstance.extend({
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  },
  cache: 'no-store',
  hooks: {
    beforeRequest: [
      request => {
        const token = getToken()
        if (token) {
          request.headers.set('Authorization', token)
        } else {
          return new Response(JSON.stringify({ status: 'failed', message: 'no token' }))
        }
      },
    ],
  },
})

function checkTokenBeforeRequest(request: Request) {
  const token = getToken()
  if (token) {
    request.headers.set('Authorization', token)
  } else {
    return new Response(JSON.stringify({ status: 'failed', message: 'no token' }))
  }
}
const uploadFileKy: KyInstance = defaultContentKyInstance.extend({
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  },
  cache: 'no-store',
  hooks: {
    beforeRequest: [checkTokenBeforeRequest],
  },
})

const uploadFileAxios: Axios = axios.create({
  timeout: 30 * Times.SECOND,
})

uploadFileAxios.interceptors.request.use(function (request) {
  const token = getToken()
  if (!token) {
    return Promise.reject(JSON.stringify({ status: 'failed', message: 'no token' }))
  }
  request.headers.Authorization = token
  return request
})

const contentKy: KyInstance = ky.extend({
  headers: {
    'Cache-Control': cacheControlForPublicAPIs,
  },
  timeout: 60 * Times.SECOND,
  throwHttpErrors: true,
})

const helpKy: KyInstance = ky.extend({
  headers: {
    'Cache-Control': cacheControlForPublicAPIs,
  },
  timeout: 60 * Times.SECOND,
  throwHttpErrors: true,
})

const magKy: KyInstance = ky.extend({
  headers: {
    'Cache-Control': cacheControlForPublicAPIs,
  },
  timeout: 60 * Times.SECOND,
  throwHttpErrors: true,
})

const nobiGiftKy: KyInstance = authorizedKy.extend({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60 * Times.SECOND,
  throwHttpErrors: true,
})

const googleKy: KyInstance = ky.extend({
  headers: {
    'Cache-Control': cacheControlForPublicAPIs,
  },
})

export {
  authorizedKy,
  publicKy,
  cdnKy,
  googleKy,
  contentKy,
  helpKy,
  magKy,
  HTTPError,
  TimeoutError,
  nobiGiftKy,
  uploadFileKy,
  uploadFileAxios,
}
export type { KyInstance, Options, AxiosProgressEvent }
