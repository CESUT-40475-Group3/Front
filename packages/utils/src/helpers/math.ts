export function calcDecimalPlace(num: number | string): number {
  num = num.toString()
  const [, decimalPart] = num.split('.')
  if (!decimalPart) return 0
  return decimalPart.replace(/0+$/, '').length
}

export function safeParseFloat(value: any): number {
  return value ? parseFloat(value) || 0 : 0
}
