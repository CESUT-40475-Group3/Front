export function asyncTimeout(timeout: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (!text) return false
    await navigator?.clipboard?.writeText(text)
    return true
  } catch {
    return false
  }
}

export async function shareContent(
  data: ShareData,
  onErrorCallback?: (e: any) => any,
  onNavigatorUnavailableCallback?: () => any
): Promise<boolean> {
  if (navigator?.share) {
    try {
      await navigator.share(data)
      return true
    } catch (e) {
      onErrorCallback?.(e)
      return false
    }
  }
  onNavigatorUnavailableCallback?.()
  return false
}

export async function readFromClipboard() {
  try {
    return await navigator?.clipboard?.readText()
  } catch {
    return ''
  }
}

export function isBrowser(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined'
  } catch {
    return false
  }
}

export function isPromise(value: any): boolean {
  return !!value && typeof value.then === 'function'
}

export function throttle<T extends (...args: any[]) => any>(func: T, timeFrame: number = 350) {
  let waiting = false
  return function (this: unknown, ...args: Parameters<T>) {
    if (!waiting) {
      func.apply(this, args)
      waiting = true
      setTimeout(() => {
        waiting = false
      }, timeFrame)
    }
  }
}

export function getMobileOS() {
  if (!isBrowser()) return 'Unknown'
  const userAgent = navigator?.userAgent?.toLocaleLowerCase()
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iOS'
  } else if (/android/i.test(userAgent)) {
    return 'Android'
  }
  return 'Unknown'
}

export const writeToTxtFile = (fileName: string, content: string) => {
  // Create a Blob with the content
  const blob = new Blob([content], { type: 'text/plain' })

  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')

  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.txt` // Set the desired file name
  a.style.display = 'none'

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

export function callOnServerOnly<T extends (...args: any) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> | void {
  return (...args: Parameters<T>) => {
    if (!isBrowser()) {
      return func.apply(func, [...args])
    }
    return
  }
}

export const debounce = <T extends (...args: any[]) => any>(func: T, wait = 800, immediate = false) => {
  let timeout: NodeJS.Timeout | undefined = undefined
  return function (...args: Parameters<T>): void {
    const later = function () {
      timeout = undefined
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}
