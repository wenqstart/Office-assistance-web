// 防抖函数
export function debounce(fn: any, wait = 500, isImmediate = false) {
  let timerId: any = null
  let flag = true
  if (isImmediate) {
    return function (...rest) {
      clearTimeout(timerId)
      if (flag) {
        /** @ts-ignore */
        fn.apply(this, rest)
        flag = false
      }
      timerId = setTimeout(() => {
        flag = true
      }, wait)
    }
  }

  return function (...rest) {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      /** @ts-ignore */
      fn.apply(this, rest)
    }, wait)
  }
}

/**
 * @method
 * @desc 节流方法
 * @param {function} fn 节流回调的方法
 * @param {number} wait 节流的时间差， 500毫秒内不会触发第二次方法
 */
export function throttle(fn: any, wait = 500) {
  let timer: any = null
  return function (...args) {
    if (!timer) {
      /** @ts-ignore */
      timer = setTimeout(() => {
        /** @ts-ignore */
        fn.call(this, args)
        // 执行完后将timer清掉
        timer = null
      }, wait)
    }
  }
}
