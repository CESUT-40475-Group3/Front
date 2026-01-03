import { createLogger, format, Logger, transports } from 'winston'

import { isBrowser } from './general'

const logger: Logger | null = null

function getServerLogger() {
  if (!isBrowser() && !logger) {
    return createLogger({
      transports: [
        new transports.Console({
          handleExceptions: true,
          eol: '\n',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.prettyPrint(),
            format.colorize({
              all: true,
            }),
            format.label({
              label: '[LOGGER]',
            }),
            format.printf(info => `${info.label}  ${info.timestamp}  ${info.level}: ${info.message}`)
          ),
        }),
      ],
    })
  } else {
    return logger
  }
}

export function logServer<T = any>(message?: T, ...args: T[]): void {
  if (!isBrowser()) {
    const otherMessages = args ? args.map(arg => `, ${JSON.stringify(arg)}`) : ''
    getServerLogger()?.log('info', `${JSON.stringify(message)}${otherMessages}`, [])
  }
}

logServer.error = <T = any>(message?: T, ...args: T[]) => {
  if (!isBrowser()) {
    const otherMessages = args ? args.map(arg => `, ${JSON.stringify(arg)}`) : ''
    getServerLogger()?.error(`${JSON.stringify(message)}${otherMessages}`, [])
  }
}

logServer.info = <T = any>(message?: T, ...args: T[]) => {
  if (!isBrowser()) {
    const otherMessages = args ? args.map(arg => `, ${JSON.stringify(arg)}`) : ''
    getServerLogger()?.info(`${JSON.stringify(message)}${otherMessages}`, [])
  }
}

logServer.warn = <T = any>(message?: T, ...args: T[]) => {
  if (!isBrowser()) {
    const otherMessages = args ? args.map(arg => `, ${JSON.stringify(arg)}`) : ''
    getServerLogger()?.warn(`${JSON.stringify(message)}${otherMessages}`, [])
  }
}
