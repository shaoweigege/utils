/**
 * lazyfunc
 * 函数延迟调用
 */

export function Lazyfunc<T extends Record<string, any>>(target: T, properties: string[]): T {
  let resolves: any[] = [];
  const funcs: any = {};

  const getFunc = function (propertyKey: string) {
    if (Object.prototype.hasOwnProperty.call(funcs, propertyKey)) {
      return funcs[propertyKey];
    }
    return null;
  };

  const newPromise = function (propertyKey: string, ...args: any[]) {
    const func = getFunc(propertyKey);
    if (func) {
      return func(...args);
    }
    return new Promise((resolve) => {
      resolves.push([resolve, args]);
    });
  };

  properties.forEach((propertyKey) => {
    Object.defineProperty(target, propertyKey, {
      get() {
        const func = getFunc(propertyKey);
        if (func) {
          return func;
        } else {
          return newPromise.bind(this, propertyKey);
        }
      },
      set(val) {
        if (Object.prototype.hasOwnProperty.call(target, propertyKey) && properties.indexOf(propertyKey) > -1) {
          funcs[propertyKey as string] = val;
          if (resolves.length) {
            resolves.forEach(([resolve, args]) => {
              resolve(val(...args));
            });
            resolves = [];
          }
        }
      }
    });
  });

  return target;
}

// proxy 模式
function LazyFuncProxy<T extends Record<string, (...args: any[]) => Promise<any>>, TKey extends keyof T>(
  target: T,
  properties: TKey[]
): T {
  let args: any[];
  const funcs: any[] = [];
  let promiseResolve: any;

  let target_;

  const revocable = Proxy.revocable(target, {
    get(target, property: TKey) {
      const propertyKey = property.toString();
      if (Object.prototype.hasOwnProperty.call(target, propertyKey) && properties.indexOf(property) > -1) {
        if (funcs.indexOf(propertyKey) > -1) {
          return target[propertyKey];
        } else {
          return function (...args_: any[]) {
            return new Promise((resolve) => {
              args = args_;
              promiseResolve = resolve;
            });
          };
        }
      }
    },
    deleteProperty(): boolean {
      return true;
    },
    set(target, property: TKey, value, receiver) {
      const propertyKey = property.toString();
      if (Object.prototype.hasOwnProperty.call(target, propertyKey) && properties.indexOf(property) > -1) {
        /* if (
          Object.prototype.toString.call(value) !== '[object Null]' &&
          Object.prototype.toString.call(value) === '[object Undefined]'
        ) {
        } */

        if (promiseResolve) {
          promiseResolve(value(...args));
          promiseResolve = null;
        }

        (target as any)[propertyKey] = value;

        funcs.push(propertyKey);

        if (funcs.length === properties.length) {
          // 所绑定的属性均已执行过 set，清除 proxy
          target_ = target;
          // revocable.revoke();
        }

        return true;
      } else {
        return Reflect.set(target, property, value, receiver);
      }

      // target[property] = value;
    }
  });

  target_ = revocable.proxy;

  return target_;
}
