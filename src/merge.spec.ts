/**
 * merge.spec
 */

import { MergeProps } from './merge';

jest.setTimeout(30000);

test('utils MergeProps', (done) => {
  const target = {
    a: 2,
    b: {
      arr: [{ a: 1, b: 2 }],
      arr2: [{ c: '312' }],
      c: '3',
      e: 123,
      h: {
        s: 111
      }
    },
    c: {
      dd: 1
    }
  };

  const source = {
    a: '3',
    b: {
      arr: [{ a: 3, b: 4, d: 5 }],
      c: 1412,
      d: 4,
      e: {
        f: 123,
        g: '31'
      }
    }
  } as any;

  MergeProps(target, source);

  expect(source.a).toBe('3');
  expect(source.b.arr[0].a).toBe(3);
  expect(source.b.arr2[0].c).toBe('312');
  expect(source.b.c).toBe(1412);
  expect(source.b.d).toBe(4);
  expect(source.b.h.s).toBe(111);

  setTimeout(() => {
    target.c.dd = 1234;
    target.b.arr2[0].c = '12312';

    expect(source.c.dd).toBe(1234);
    expect(source.b.arr2[0].c).toBe('12312');

    done();
  }, 3000);
});

test('utils MergeProps deep', (done) => {
  const target = {
    a: 2,
    b: {
      arr: [{ a: 1, b: 2 }],
      arr2: [{ c: '312' }],
      c: '3',
      e: 123,
      h: {
        s: 111
      }
    },
    c: {
      dd: 1
    }
  };

  const source = {
    a: '3',
    b: {
      arr: [{ a: 3, b: 4, d: 5 }],
      c: 1412,
      d: 4,
      e: {
        f: 123,
        g: '31'
      }
    }
  } as any;

  MergeProps(target, source, true);

  expect(source.a).toBe('3');
  expect(source.b.arr[0].a).toBe(3);
  expect(source.b.arr2[0].c).toBe('312');
  expect(source.b.c).toBe(1412);
  expect(source.b.d).toBe(4);
  expect(source.b.h.s).toBe(111);

  setTimeout(() => {
    target.c.dd = 1234;
    target.b.arr2[0].c = '12312';

    expect(source.c.dd).toBe(1);
    expect(source.b.arr2[0].c).toBe('312');

    done();
  }, 3000);
});
