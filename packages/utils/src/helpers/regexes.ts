/**
 * Regular expression that matches any character that is not a number, alphabetic character, or underscore.
 * @type {RegExp}
 */
export const notAlphaNumericUnderscore: RegExp = /[^a-zA-Z0-9_]/g

export function convertPersianNumbersToEnglish(str: string) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

  if (str) {
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString())
    }
  }

  return str
}

export function convertEnglishNumbersToPersian(str: string): string {
  const persianNumeral = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

  return str.replace(/\d/g, digit => persianNumeral[Number(digit)])
}

export function containsOnlyEnglishCharsAndDigits(inputString: string): boolean {
  const nonEnglishCharOrDigitRegex = /[^a-zA-Z0-9]/
  return !nonEnglishCharOrDigitRegex.test(inputString)
}
