import { describe, expect, it } from 'vitest';
import {
  draw,
  isArray,
  isDate,
  isEmpty,
  isFloat,
  isFn,
  isInt,
  isNumber,
  isObject,
  isPrimitive,
  isPromise,
  isString,
  // Type checking utilities
  isSymbol,
  // Array utilities
  iterate,
  list,
  // Random utilities
  random,
  range,
  shuffle,
  uid,
} from '~/lodash';

describe('lodash utilities', () => {
  describe('Array utilities', () => {
    describe('iterate', () => {
      it('should iterate specified number of times', () => {
        const result = iterate(3, (acc, i) => acc + i, 0);
        expect(result).toBe(6); // 0 + 1 + 2 + 3
      });

      it('should start from 1 not 0', () => {
        const iterations: number[] = [];
        iterate(
          3,
          (acc, i) => {
            iterations.push(i);
            return acc;
          },
          0
        );
        expect(iterations).toEqual([1, 2, 3]);
      });
    });

    describe('range', () => {
      it('should generate range with single parameter', () => {
        const result = Array.from(range(3));
        expect(result).toEqual([0, 1, 2, 3]);
      });

      it('should generate range with start and end', () => {
        const result = Array.from(range(1, 3));
        expect(result).toEqual([1, 2, 3]);
      });

      it('should generate range with mapper function', () => {
        const result = Array.from(range(0, 2, (i) => `item${i}`));
        expect(result).toEqual(['item0', 'item1', 'item2']);
      });

      it('should generate range with step', () => {
        const result = Array.from(range(0, 6, (i) => i, 2));
        expect(result).toEqual([0, 2, 4, 6]);
      });
    });

    describe('list', () => {
      it('should create list from range', () => {
        const result = list(3);
        expect(result).toEqual([0, 1, 2, 3]);
      });

      it('should create list with custom values', () => {
        const result = list(0, 2, 'x');
        expect(result).toEqual(['x', 'x', 'x']);
      });
    });
  });

  describe('Type checking utilities', () => {
    describe('isSymbol', () => {
      it('should identify symbols', () => {
        expect(isSymbol(Symbol('test'))).toBe(true);
        expect(isSymbol('test')).toBe(false);
        expect(isSymbol(null)).toBe(false);
      });
    });

    describe('isArray', () => {
      it('should identify arrays', () => {
        expect(isArray([])).toBe(true);
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isArray('test')).toBe(false);
      });
    });

    describe('isObject', () => {
      it('should identify plain objects', () => {
        expect(isObject({})).toBe(true);
        expect(isObject({ key: 'value' })).toBe(true);
        expect(isObject([])).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject('test')).toBe(false);
      });
    });

    describe('isPrimitive', () => {
      it('should identify primitive values', () => {
        expect(isPrimitive(42)).toBe(true);
        expect(isPrimitive('string')).toBe(true);
        expect(isPrimitive(true)).toBe(true);
        expect(isPrimitive(null)).toBe(true);
        expect(isPrimitive(undefined)).toBe(true);
        expect(isPrimitive(Symbol('test'))).toBe(true);
        expect(isPrimitive({})).toBe(false);
        expect(isPrimitive([])).toBe(false);
        const testFn = () => {
          // Test function
        };
        expect(isPrimitive(testFn)).toBe(false);
      });
    });

    describe('isFn', () => {
      it('should identify functions', () => {
        const testFn1 = () => {
          return 'test';
        };
        const testFn2 = function test() {
          return 'test';
        };
        expect(isFn(testFn1)).toBe(true);
        expect(isFn(testFn2)).toBe(true);
        expect(isFn('test')).toBe(false);
        expect(isFn({})).toBe(false);
      });
    });

    describe('isString', () => {
      it('should identify strings', () => {
        expect(isString('test')).toBe(true);
        expect(isString(String('test'))).toBe(true);
        expect(isString(42)).toBe(false);
        expect(isString(null)).toBe(false);
      });
    });

    describe('isInt', () => {
      it('should identify integers', () => {
        expect(isInt(42)).toBe(true);
        expect(isInt(0)).toBe(true);
        expect(isInt(-5)).toBe(true);
        expect(isInt(3.14)).toBe(false);
        expect(isInt('42')).toBe(false);
      });
    });

    describe('isFloat', () => {
      it('should identify floating point numbers', () => {
        expect(isFloat(3.14)).toBe(true);
        expect(isFloat(-2.5)).toBe(true);
        expect(isFloat(42)).toBe(false);
        expect(isFloat('3.14')).toBe(false);
      });
    });

    describe('isNumber', () => {
      it('should identify numbers', () => {
        expect(isNumber(42)).toBe(true);
        expect(isNumber(3.14)).toBe(true);
        expect(isNumber(-5)).toBe(true);
        expect(isNumber('42')).toBe(false);
        expect(isNumber(null)).toBe(false);
      });
    });

    describe('isDate', () => {
      it('should identify Date objects', () => {
        expect(isDate(new Date())).toBe(true);
        expect(isDate(new Date('2023-01-01'))).toBe(true);
        expect(isDate('2023-01-01')).toBe(false);
        expect(isDate(1_640_995_200_000)).toBe(false);
      });
    });

    describe('isPromise', () => {
      it('should identify promises', () => {
        expect(isPromise(Promise.resolve())).toBe(true);
        const testPromise = new Promise(() => {
          // Test promise
        });
        expect(isPromise(testPromise)).toBe(true);
        // Test thenable objects
        const thenMethod = () => {
          return 'test';
        };
        const thenKey = 'then';
        const thenLike = {
          [thenKey]: thenMethod,
        };
        expect(isPromise(thenLike)).toBe(true);
        expect(isPromise({})).toBe(false);
        expect(isPromise(null)).toBe(false);
      });
    });

    describe('isEmpty', () => {
      it('should identify empty values', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty(0)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty(true)).toBe(true);
        expect(isEmpty(false)).toBe(true);
        expect(isEmpty(new Date('invalid'))).toBe(true);

        expect(isEmpty(42)).toBe(false);
        expect(isEmpty('test')).toBe(false);
        expect(isEmpty([1])).toBe(false);
        expect(isEmpty({ key: 'value' })).toBe(false);
        const testFn = () => {
          return 'test';
        };
        expect(isEmpty(testFn)).toBe(false);
        expect(isEmpty(Symbol('test'))).toBe(false);
      });
    });
  });

  describe('Random utilities', () => {
    describe('random', () => {
      it('should generate random number within range', () => {
        const result = random(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      });

      it('should handle same min and max', () => {
        const result = random(5, 5);
        expect(result).toBe(5);
      });
    });

    describe('draw', () => {
      it('should draw random item from array', () => {
        const array = ['a', 'b', 'c'];
        const result = draw(array);
        expect(array).toContain(result);
      });

      it('should return null for empty array', () => {
        const result = draw([]);
        expect(result).toBe(null);
      });
    });

    describe('shuffle', () => {
      it('should shuffle array elements', () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = shuffle(original);

        expect(shuffled).toHaveLength(original.length);
        expect(shuffled.sort()).toEqual(original.sort());
        // Note: There's a tiny chance this could fail if shuffle returns original order
        // but it's statistically very unlikely
      });

      it('should not modify original array', () => {
        const original = [1, 2, 3];
        const originalCopy = [...original];
        shuffle(original);
        expect(original).toEqual(originalCopy);
      });
    });

    describe('uid', () => {
      it('should generate unique id of specified length', () => {
        const result = uid(10);
        expect(result).toHaveLength(10);
        expect(typeof result).toBe('string');
      });

      it('should generate different ids on multiple calls', () => {
        const id1 = uid(10);
        const id2 = uid(10);
        expect(id1).not.toBe(id2);
      });

      it('should include special characters when provided', () => {
        const result = uid(20, '!@#');
        expect(result).toHaveLength(20);
        // Hard to test if specials are actually used without making it flaky
        // but we can at least verify it doesn't throw
      });
    });
  });
});
