export const getURLPathname = (url: string) => {
  try {
    const result = new URL(url)
    return result.href.replace(result.origin, '')
  } catch {
    return url
  }
}
