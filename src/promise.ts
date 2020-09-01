/**
 * promise
 * 与 promise 有关的通用函数
 */

/**
 * 将指定的异步函数转换为队列模式，即每次调用后将进行等待，直到上一次调用完毕后再执行;
 * 类似 debounce 函数，不过执行逻辑是等待上次执行的结果，非指定时间内
 * 当设置 skipped 为 true，若上次执行的 promise 已完成，则执行此次调用，否则将返回上次执行的 promise
 * @param func
 * @param options
 * @constructor
 */
export function PromiseQueue<TFunc extends (...args: any[]) => Promise<any>>(
  func: TFunc,
  options?: { skipped: boolean }
): TFunc {
  let promise: Promise<any>;
  let resolved: boolean;

  return function (...args: TFunc extends (...args: infer U) => any ? U : never) {
    if (!promise || resolved) {
      resolved = false;
      promise = func(...args).finally(() => {
        resolved = true;
      });
      return promise;
    }
    if (options?.skipped) {
      return promise;
    } else {
      return promise.then(() => {
        return func(...args);
      });
    }
  } as any;
}
