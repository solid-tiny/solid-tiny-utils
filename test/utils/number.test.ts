import { describe, expect, it } from 'vitest';
import { clamp, inRange, max, min, toHex } from '~/utils';

describe('Number utilities', () => {
  describe('min', () => {
    it('should return the smallest number', () => {
      expect(min(1, 2, 3)).toBe(1);
      expect(min(-5, 0, 10)).toBe(-5);
      expect(min(3.14, 2.71, 1.41)).toBe(1.41);
    });

    it('should handle single number', () => {
      expect(min(42)).toBe(42);
    });

    it('should handle negative numbers', () => {
      expect(min(-1, -2, -3)).toBe(-3);
    });
  });

  describe('max', () => {
    it('should return the largest number', () => {
      expect(max(1, 2, 3)).toBe(3);
      expect(max(-5, 0, 10)).toBe(10);
      expect(max(3.14, 2.71, 1.41)).toBe(3.14);
    });

    it('should handle single number', () => {
      expect(max(42)).toBe(42);
    });

    it('should handle negative numbers', () => {
      expect(max(-1, -2, -3)).toBe(-1);
    });
  });

  describe('clamp', () => {
    it('should clamp within default range (0-1)', () => {
      expect(clamp(0.5)).toBe(0.5);
      expect(clamp(-0.1)).toBe(0);
      expect(clamp(1.5)).toBe(1);
    });

    it('should clamp within custom range', () => {
      expect(clamp(15, 10, 20)).toBe(15);
      expect(clamp(5, 10, 20)).toBe(10);
      expect(clamp(25, 10, 20)).toBe(20);
    });

    it('should handle boundary values', () => {
      expect(clamp(0)).toBe(0);
      expect(clamp(1)).toBe(1);
      expect(clamp(10, 10, 20)).toBe(10);
      expect(clamp(20, 10, 20)).toBe(20);
    });

    it('should handle inverted min/max gracefully', () => {
      // When min > max, clamp should still work logically
      expect(clamp(15, 20, 10)).toBe(10); // clamps to the "maximum" of the two bounds
    });
  });

  describe('inRange', () => {
    describe('default inclusive range [0, 1]', () => {
      it('should return true for values in range', () => {
        expect(inRange(0.5)).toBe(true);
        expect(inRange(0)).toBe(true);
        expect(inRange(1)).toBe(true);
      });

      it('should return false for values outside range', () => {
        expect(inRange(-0.1)).toBe(false);
        expect(inRange(1.1)).toBe(false);
      });
    });

    describe('custom range [10, 20]', () => {
      it('should work with custom bounds', () => {
        expect(inRange(15, 10, 20)).toBe(true);
        expect(inRange(10, 10, 20)).toBe(true);
        expect(inRange(20, 10, 20)).toBe(true);
        expect(inRange(5, 10, 20)).toBe(false);
        expect(inRange(25, 10, 20)).toBe(false);
      });
    });

    describe('inclusivity modes', () => {
      it('should handle inclusive bounds []', () => {
        expect(inRange(10, 10, 20, '[]')).toBe(true);
        expect(inRange(20, 10, 20, '[]')).toBe(true);
        expect(inRange(15, 10, 20, '[]')).toBe(true);
      });

      it('should handle exclusive bounds ()', () => {
        expect(inRange(10, 10, 20, '()')).toBe(false);
        expect(inRange(20, 10, 20, '()')).toBe(false);
        expect(inRange(15, 10, 20, '()')).toBe(true);
      });

      it('should handle lower inclusive, upper exclusive [)', () => {
        expect(inRange(10, 10, 20, '[)')).toBe(true);
        expect(inRange(20, 10, 20, '[)')).toBe(false);
        expect(inRange(15, 10, 20, '[)')).toBe(true);
      });

      it('should handle lower exclusive, upper inclusive (]', () => {
        expect(inRange(10, 10, 20, '(]')).toBe(false);
        expect(inRange(20, 10, 20, '(]')).toBe(true);
        expect(inRange(15, 10, 20, '(]')).toBe(true);
      });
    });
  });

  describe('toHex', () => {
    it('should convert number to hex string', () => {
      expect(toHex(255)).toBe('ff');
      expect(toHex(255, 4)).toBe('00ff');
    });
  });
});
