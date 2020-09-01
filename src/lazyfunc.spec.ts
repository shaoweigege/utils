/**
 * lazyfunc.spec
 */

import { Lazyfunc } from './lazyfunc';

jest.setTimeout(30000);

function LazyfuncTest() {
  const target: {
    sayHello: (name: string, words: string, num: number) => Promise<string>;
  } = {
    sayHello: null
  };

  const targetLazy = Lazyfunc(target, ['sayHello']);

  // 保存到变量，延迟调用
  const sayHello = targetLazy.sayHello;

  // 立即执行
  console.time('tom call completed');
  targetLazy.sayHello('tom', 'hello', 100).then((res) => {
    console.timeEnd('tom call completed');
  });

  // 等待 2s 后再次执行
  setTimeout(() => {
    console.time('tom2 call completed');
    targetLazy.sayHello('tom2', 'hello', 100).then((res) => {
      console.timeEnd('tom2 call completed');
    });
  }, 2000);

  // 等待 5s 后设置 func
  setTimeout(() => {
    targetLazy.sayHello = (name: string, words: string, num: number) => {
      return new Promise((resolve) => {
        let i = 0;

        let timer = setInterval(() => {
          i++;
          console.log(`___${name} wait ${i}s`);
        }, 1000);

        // 模拟延迟
        setTimeout(() => {
          resolve(`${name} ${words} ${num} ${i}`);
          clearInterval(timer);
          timer = null;
        }, 3000);
      });
    };

    console.time('jerry1 call completed');
    targetLazy.sayHello('jerry1', 'hello', 200).then((res) => {
      console.timeEnd('jerry1 call completed');
    });

    console.time('jerry2 call completed');
    targetLazy.sayHello('jerry2', 'hello', 200).then((res) => {
      console.timeEnd('jerry2 call completed');
    });

    console.time('tom3 call completed');
    sayHello('tom3', 'hello', 200).then((res) => {
      console.timeEnd('tom3 call completed');
    });

    setTimeout(() => {
      console.time('jerry3 call completed');
      targetLazy.sayHello('jerry3', 'hello', 200).then((res) => {
        console.timeEnd('jerry3 call completed');
      });
    }, 10000);
  }, 5000);
}

test('utils lazyfunc', (done) => {
  const target: {
    sayHello: (name: string, words: string, num: number) => Promise<string>;
  } = {
    sayHello: null
  };

  const targetLazy = Lazyfunc(target, ['sayHello']);

  // 立即执行
  targetLazy.sayHello('tom', 'hello', 100).then((res) => {
    expect(res).toBe('tom hello 100 3');
  });

  // 等待 3s 后设置 func
  setTimeout(() => {
    targetLazy.sayHello = (name: string, words: string, num: number) => {
      return new Promise((resolve) => {
        let i = 0;

        let timer = setInterval(() => {
          i++;
        }, 1000);

        // 模拟延迟
        setTimeout(() => {
          i++;
          resolve(`${name} ${words} ${num} ${i}`);
          clearInterval(timer);
          timer = null;
        }, 3000);
      });
    };
    targetLazy.sayHello('jerry1', 'hello', 200);
    targetLazy.sayHello('jerry2', 'hello', 200);
    setTimeout(() => {
      targetLazy.sayHello('jerry3', 'hello', 200).then((res) => {
        expect(res).toBe('jerry3 hello 200 3');
        done();
      });
    }, 12000);
  }, 5000);
});
