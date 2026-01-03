export function chunkString(str: string, chunksLength: number): string[] {
  if (chunksLength <= 0 || !Number.isInteger(chunksLength)) throw new Error('chunksLength must be a positive integer')
  return str.match(new RegExp('(.|[\\r\\n]){1,' + chunksLength + '}', 'g')) || []
}

export function kebabCaseToCamelCase(str: string): string {
  return str.toLowerCase().replace(/-([a-z])/g, g => g[1].toUpperCase())
}

export function camelCaseToKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export function capFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function capFirstLetters(str: string): string {
  return str.split(' ').map(capFirstLetter).join(' ')
}
