import { Times } from '../constants.js'

export type PredefinedDateTimeFormats =
  | 'fullNumericDateTime'
  | 'fullDateTime'
  | 'fullDate'
  | 'monthAndDay'
  | 'fullTime'
  | 'time'
export type DateTimeFormatTypes = PredefinedDateTimeFormats | Intl.DateTimeFormatOptions

const formatMap = new Map<PredefinedDateTimeFormats, Intl.DateTimeFormatOptions>([
  [
    'fullNumericDateTime',
    {
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  ],
  [
    'fullDateTime',
    {
      hourCycle: 'h23',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  ],
  ['fullDate', { hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }],
  ['monthAndDay', { hourCycle: 'h23', month: '2-digit', day: '2-digit' }],
  ['fullTime', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }],
  ['time', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' }],
])

export function formatDateTime(
  date: Date | string,
  format: DateTimeFormatTypes = 'fullNumericDateTime',
  locales: string | string[] = 'fa-IR'
): string {
  const isPersianDigit =
    typeof window !== 'undefined' && localStorage
      ? locales.includes('en')
        ? false
        : localStorage.getItem('persian-digits')
      : null
  const options: Intl.DateTimeFormatOptions = typeof format === 'string' ? formatMap.get(format) || {} : format
  return new Intl.DateTimeFormat(locales, {
    ...options,
    numberingSystem: isPersianDigit === 'true' ? 'arabext' : 'latn',
  }).format(new Date(date))
}

export function relativeDateTime(date: Date | string, locales: string | string[] = 'fa-IR'): string {
  const rtf = new Intl.RelativeTimeFormat(locales, {
    style: 'long',
    numeric: 'auto',
  })
  const NOW = new Date()
  const diff = subtractDates(date, NOW, Times.MILLISECOND)

  if (Math.abs(diff) < Times.MINUTE) {
    const seconds = Math.round(diff / Times.SECOND)
    return rtf.format(seconds, 'second')
  }

  if (Math.abs(diff) < Times.HOUR) {
    const minutes = Math.round(diff / Times.MINUTE)
    return rtf.format(minutes, 'minute')
  }

  if (Math.abs(diff) < Times.DAY) {
    const hours = Math.round(diff / Times.HOUR)
    return rtf.format(hours, 'hour')
  }

  if (Math.abs(diff) < Times.MONTH) {
    const days = Math.round(diff / Times.DAY)
    return rtf.format(days, 'day')
  }

  if (Math.abs(diff) < Times.YEAR) {
    const months = Math.round(diff / Times.MONTH)
    return rtf.format(months, 'month')
  }

  const years = Math.round(diff / Times.YEAR)
  return rtf.format(years, 'year')
}

export function addSecondsToDate(date: Date | string, ...seconds: number[]): Date {
  const totalSeconds: number = seconds.reduce((sum, cur) => sum + cur, 0)
  return new Date(new Date(date).getTime() + totalSeconds * 1000)
}

export function subtractDates(dateA: Date | string, dateB: Date | string, unit: Times = Times.SECOND): number {
  return (new Date(dateA).getTime() - new Date(dateB).getTime()) / unit
}
