export enum Num {
  ZERO = 0,
  HUNDRED = 100,
  THOUSAND = 1000,
  MILLION = 1000000,
  BILLION = 1000000000,
}

export enum Times {
  MILLISECOND = 1,
  SECOND = 1000,
  MINUTE = 60000,
  HOUR = 3600000,
  DAY = 86400000,
  WEEK = 604800000,
  MONTH = 2592000000,
  YEAR = 31536000000,
}

export enum BreakPoints {
  MOBILE = 320,
  TABLET = 768,
  DESKTOP = 1200,
  LARGE_DESKTOP = 1380,
}

export enum Screens {
  MOBILE = `(min-width: ${BreakPoints.MOBILE}px)`,
  TABLET = `(min-width: ${BreakPoints.TABLET}px)`,
  DESKTOP = `(min-width: ${BreakPoints.DESKTOP}px)`,
  LARGE_DESKTOP = `(min-width: ${BreakPoints.LARGE_DESKTOP}px)`,
}

export const TRADE_AMOUNT_STEPS = [
  1000000000,
  3000000000,
  10000000000,
  50000000000,
  200000000000,
  800000000000,
  Number.MAX_SAFE_INTEGER,
]

export const TOKEN_KEY = 'token'
