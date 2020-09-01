/**
 * promise.spec
 */

import { PromiseQueue } from './promise';

jest.setTimeout(30000);

const promise = function (ref: { num: number }, name: string, time: number): Promise<string> {
  return new Promise((resolve) => {
    // 累加
    let timer = setInterval(() => {
      ref.num++;
    }, 1000);

    // 模拟延迟
    setTimeout(() => {
      ref.num++;
      resolve(ref.num + name);
      clearInterval(timer);
      timer = null;
    }, time);
  });
};

test('utils PromiseQueue normal', (done) => {
  const g = { num: 0 };

  promise(g, 'tom', 3000).then((res) => {
    console.log(`res：${res} g.num：${g.num}`);
    expect(g.num).toBe(4);
  });

  // 等待 1s 后再次执行，此时前一次执行还未完成
  setTimeout(() => {
    console.log(`bind new promise`);
    promise(g, 'jerry', 4000).then((res) => {
      console.log(`res：${res} g.num：${g.num}`);
      expect(g.num).toBe(7);
      done();
    });
  }, 1000);
});

test('utils PromiseQueue', (done) => {
  const promise_ = PromiseQueue(promise);

  const g = { num: 0 };

  promise_(g, 'tom', 3000).then(() => {
    expect(g.num).toBe(3);
  });

  // 等待 1s 后再次执行，此时前一次执行还未完成
  setTimeout(() => {
    promise_(g, 'jerry', 4000).then(() => {
      expect(g.num).toBe(7);
      done();
    });
  }, 1000);
});

test('utils PromiseQueue skipped', (done) => {
  const promise_ = PromiseQueue(promise, {
    skipped: true
  });

  const g = { num: 0 };

  promise_(g, 'tom', 3000).then(() => {
    expect(g.num).toBe(3);
  });

  // 等待 1s 后再次执行，此时前一次执行还未完成
  setTimeout(() => {
    promise_(g, 'jerry', 4000).then(() => {
      expect(g.num).toBe(3);
      done();
    });
  }, 1000);
});
