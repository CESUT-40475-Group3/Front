function toPersianDigits(number: string) {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return number?.replace(/[0-9]/g, function (w) {
    return id[+w]
  })
}

export function toWords(value: number | string, prefix = '', translateToPersian = false) {
  try {
    if (value === null || value === undefined || value === '' || value === 0 || value === '0') return 0 + ' ' + prefix

    const wordLayout: string[] = []
    value = Number(String(value)?.replace(/\D/g, ''))
    if (value < Math.pow(10, 15)) {
      const numbering = ['', 'هزار', 'میلیون', 'میلیارد', 'بیلیون']
      const processedVal = value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .split(',')
      numbering.splice(processedVal.length)
      processedVal.map((x, i) => {
        if (Number(x) !== 0) {
          const postfix = numbering[numbering.length - i - 1]
          const val = processedVal[i]
          translateToPersian
            ? wordLayout.push(`${toPersianDigits(val) + ' ' + postfix}`)
            : wordLayout.push(Number(val) + ' ' + postfix)
        }
        return wordLayout
      })
      return wordLayout.join(' ' + 'و' + ' ') + ' ' + prefix
    } else {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  } catch {
    return value + ' ' + prefix
  }
}
