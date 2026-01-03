import holidaysData from '@networking/shared-assets/holidays/holidays.json'

import { formatDateTime } from './date'
import { convertPersianNumbersToEnglish } from './regexes'
import logger from './logger'

type EstimationType = 'HOLIDAY' | 'BEFORE_NOON' | 'AFTER_NOON'

export function estimateSettleTime(date?: Date | string): EstimationType {
  const now = date ? new Date(date) : new Date()

  const currentYearPersian = formatDateTime(now, { year: 'numeric' })
  const currentYear = convertPersianNumbersToEnglish(currentYearPersian)

  const yearHolidays: string[] | undefined = (holidaysData as Record<string, string[]>)[currentYear]

  if (!yearHolidays) {
    logger.warn(`Holiday data for year ${currentYear} is not available.`)
    return estimateSettleTimeWithoutHolidays(now)
  }

  const holidays = new Set(yearHolidays)

  const todayJalaliPersian = formatDateTime(now, 'fullDate')
  const todayJalali = convertPersianNumbersToEnglish(todayJalaliPersian)

  const time = now.getHours() * 60 + now.getMinutes()

  const isHoliday = holidays.has(todayJalali)

  const isBeforeNoon = time < 12 * 60

  let estimationType: EstimationType

  if (isHoliday) {
    estimationType = 'HOLIDAY'
  } else if (isBeforeNoon) {
    estimationType = 'BEFORE_NOON'
  } else {
    estimationType = 'AFTER_NOON'
  }

  return estimationType
}

function estimateSettleTimeWithoutHolidays(now: Date): EstimationType {
  const time = now.getHours() * 60 + now.getMinutes()
  const dayOfWeek = now.getDay()

  const isHoliday = dayOfWeek === 5

  const isBeforeNoon = time < 12 * 60

  let estimationType: EstimationType

  if (isHoliday) {
    estimationType = 'HOLIDAY'
  } else if (isBeforeNoon) {
    estimationType = 'BEFORE_NOON'
  } else {
    estimationType = 'AFTER_NOON'
  }

  return estimationType
}
