/**
 * merge
 * 合并 object
 */

import { IsArray } from './type-check';

const cloneDeep = require('lodash/cloneDeep');

const isObject = (val: any): boolean => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

const isMergeObject = (val: any): boolean => {
  return (
    Object.prototype.toString.call(val) === '[object Object]' ||
    Object.prototype.toString.call(val) === '[object Undefined]'
  );
};

/**
 * 深度合并属性，遇到数组覆盖
 * @param defaultProps
 * @param props
 * @param deep
 * @param assignment 自定义赋值操作，默认为引用或值的传递
 * @constructor
 */
export function MergeProps<T extends Record<string, any>>(
  defaultProps: T,
  props: T,
  deep = false,
  assignment = function (target: any, property: any, val: any) {
    target[property] = val;
  }
): T {
  if (!props) {
    return defaultProps;
  }

  if (isMergeObject(defaultProps) && isMergeObject(props)) {
    Object.keys(defaultProps).forEach(function (key) {
      if (isMergeObject(props[key])) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          MergeProps(defaultProps[key], props[key], deep);
        } else {
          if (isObject(defaultProps[key])) {
            if (deep) {
              // 深度模式，进行递归合并
              assignment(props, key, {});
              MergeProps(defaultProps[key], props[key], deep);
            } else {
              assignment(props, key, defaultProps[key]);
            }
          } else if (Array.isArray(defaultProps[key])) {
            // 数组类型，将其克隆后替换
            if (deep) {
              assignment(props, key, cloneDeep(defaultProps[key]));
            } else {
              assignment(props, key, defaultProps[key]);
            }
          } else {
            // 其他非引用类型的值
            assignment(props, key, defaultProps[key]);
          }
        }
      }
    });
  }

  return props;
}

/**
 * 合并用于 vue 绑定的 props
 * @param vue
 * @param defaultProps
 * @param props
 * @constructor
 */
export function MergeVueProps<T extends Record<string, any>>(vue: any, defaultProps: T, props: T): T {
  return MergeProps(defaultProps, props, true, function (target, property, val) {
    vue.set(target, property, val);
  });
}

/**
 * 合并函数
 * @param target
 * @param handlers
 * @constructor
 */
export function MergeHandlers<TTarget extends Record<string, (...args: any[]) => Promise<any>>>(
  target: TTarget,
  handlers: TTarget
): TTarget {
  target = target || ({} as any);
  Object.keys(handlers).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target[key] = handlers[key];
  });
  return target;
}

function customizer(obj: any, src: any) {
  if (IsArray(src)) {
    return src;
  }
}
