import { describe, expect, it } from 'vitest';
import { isArray, isFn } from '../src/is';

const regexPattern = /regex/;

describe('is utilities', () => {
  describe('isFn', () => {
    it('should return true for functions', () => {
      expect(
        isFn(() => {
          return 'test';
        })
      ).toBe(true);
      expect(isFn(() => 'arrow')).toBe(true);
      expect(isFn(async () => Promise.resolve('async'))).toBe(true);
      expect(isFn(class TestClass {})).toBe(true);
      expect(isFn(Array.isArray)).toBe(true);
      expect(isFn(JSON.stringify)).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFn(null)).toBe(false);
      expect(isFn(undefined)).toBe(false);
      expect(isFn(0)).toBe(false);
      expect(isFn('')).toBe(false);
      expect(isFn({})).toBe(false);
      expect(isFn([])).toBe(false);
      expect(isFn(true)).toBe(false);
      expect(isFn(Symbol('test'))).toBe(false);
      expect(isFn(new Date())).toBe(false);
      expect(isFn(regexPattern)).toBe(false);
    });

    it('should work as a type guard', () => {
      const value: unknown = () => 'test';

      if (isFn(value)) {
        // TypeScript should know that value is a Function here
        expect(typeof value).toBe('function');
        // This should not cause a TypeScript error
        const result = value();
        expect(result).toBe('test');
      }
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b'])).toBe(true);
      expect(isArray(new Array(5))).toBe(true);
      expect(isArray(Array.from({ length: 3 }))).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray('string')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray(Symbol('test'))).toBe(false);
      expect(isArray(new Date())).toBe(false);
      expect(isArray(regexPattern)).toBe(false);
      expect(
        isArray(() => {
          return 'function';
        })
      ).toBe(false);
      // Array-like objects should return false
      expect(isArray({ length: 3, 0: 'a', 1: 'b', 2: 'c' })).toBe(false);
    });

    it('should work as a type guard', () => {
      const value: unknown = [1, 2, 3];

      if (isArray<number>(value)) {
        // TypeScript should know that value is number[] here
        expect(value.length).toBe(3);
        expect(value[0]).toBe(1);
        // This should not cause a TypeScript error
        const sum = value.reduce((acc, num) => acc + num, 0);
        expect(sum).toBe(6);
      }
    });

    it('should preserve generic type information', () => {
      const stringArray: unknown = ['a', 'b', 'c'];
      const numberArray: unknown = [1, 2, 3];

      if (isArray<string>(stringArray)) {
        expect(stringArray.every((item) => typeof item === 'string')).toBe(
          true
        );
      }

      if (isArray<number>(numberArray)) {
        expect(numberArray.every((item) => typeof item === 'number')).toBe(
          true
        );
      }
    });
  });
});
