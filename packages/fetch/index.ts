import { Times, TOKEN_KEY } from '@networking/utils/constants.js'
import ky, { HTTPError, KyInstance, TimeoutError, Options } from 'ky'
import { isBrowser } from '@networking/utils/helpers/general.js'
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

export {
  authorizedKy,
  publicKy,
  HTTPError,
  TimeoutError,
}
export type { KyInstance, Options, AxiosProgressEvent }
