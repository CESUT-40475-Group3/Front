import { getURLPathname } from './get-url-pathname'

export const isPathMatch = (urlA: string, urlB: string, { exact = true }) => {
  const normalizePathname = (url: string) =>
    getURLPathname(url)
      .replace(/\/(en|fa)\//g, '')
      .replace(/\/+$/g, '')

  const pathA = normalizePathname(urlA)
  const pathB = normalizePathname(urlB)

  return exact ? pathA === pathB : pathA.startsWith(pathB)
}
