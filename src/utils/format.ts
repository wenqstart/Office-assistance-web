// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim()
}

export const timeFormatter = (time: string) => {
  return time.replace(' ', 'T') + 'Z'
}
