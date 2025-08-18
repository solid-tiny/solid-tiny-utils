/**
 * Returns the smallest of the given numbers.
 *
 * This is a convenience wrapper around `Math.min` that provides better type safety
 * and consistency with other utility functions.
 *
 * @param numbers - The numbers to compare
 * @returns The smallest number from the input
 *
 * @example
 * ```typescript
 * min(1, 2, 3) // => 1
 * min(-5, 0, 10) // => -5
 * min(3.14, 2.71, 1.41) // => 1.41
 * ```
 */
export function min(...numbers: number[]) {
  return Math.min(...numbers);
}

/**
 * Returns the largest of the given numbers.
 *
 * This is a convenience wrapper around `Math.max` that provides better type safety
 * and consistency with other utility functions.
 *
 * @param numbers - The numbers to compare
 * @returns The largest number from the input
 *
 * @example
 * ```typescript
 * max(1, 2, 3) // => 3
 * max(-5, 0, 10) // => 10
 * max(3.14, 2.71, 1.41) // => 3.14
 * ```
 */
export function max(...numbers: number[]) {
  return Math.max(...numbers);
}

/**
 * Clamps a number to within the specified bounds.
 *
 * If the number is less than the minimum, returns the minimum.
 * If the number is greater than the maximum, returns the maximum.
 * Otherwise, returns the number unchanged.
 *
 * @param x - The number to clamp
 * @param minimum - The lower bound (inclusive)
 * @param maximum - The upper bound (inclusive)
 * @returns The clamped number
 *
 * @example
 * ```typescript
 * clamp(0.5) // => 0.5 (within default 0-1 range)
 * clamp(-0.1) // => 0 (clamped to minimum)
 * clamp(1.5) // => 1 (clamped to maximum)
 * clamp(15, 10, 20) // => 15 (within range)
 * clamp(5, 10, 20) // => 10 (clamped to minimum)
 * clamp(25, 10, 20) // => 20 (clamped to maximum)
 * ```
 */
export function clamp(x: number, minimum = 0, maximum = 1) {
  return min(maximum, max(minimum, x));
}

/**
 * Checks if a number is within a specified range.
 *
 * Supports different inclusivity modes:
 * - `'[]'` - Both bounds inclusive (default): `minimum ≤ x ≤ maximum`
 * - `'()'` - Both bounds exclusive: `minimum < x < maximum`
 * - `'[)'` - Lower inclusive, upper exclusive: `minimum ≤ x < maximum`
 * - `'(]'` - Lower exclusive, upper inclusive: `minimum < x ≤ maximum`
 *
 * @param x - The number to check
 * @param minimum - The lower bound of the range
 * @param maximum - The upper bound of the range
 * @param inclusivity - Specifies whether the bounds are inclusive or exclusive
 * @returns `true` if the number is within the range, `false` otherwise
 *
 * @example
 * ```typescript
 * // Default inclusive range [0, 1]
 * inRange(0.5) // => true
 * inRange(0) // => true (inclusive)
 * inRange(1) // => true (inclusive)
 * inRange(-0.1) // => false
 * inRange(1.1) // => false
 *
 * // Custom range [10, 20]
 * inRange(15, 10, 20) // => true
 * inRange(10, 10, 20) // => true (inclusive)
 * inRange(20, 10, 20) // => true (inclusive)
 *
 * // Exclusive bounds (10, 20)
 * inRange(15, 10, 20, '()') // => true
 * inRange(10, 10, 20, '()') // => false (exclusive)
 * inRange(20, 10, 20, '()') // => false (exclusive)
 *
 * // Mixed inclusivity [10, 20)
 * inRange(10, 10, 20, '[)') // => true (lower inclusive)
 * inRange(20, 10, 20, '[)') // => false (upper exclusive)
 * ```
 */
export function inRange(
  x: number,
  minimum = 0,
  maximum = 1,
  inclusivity: '()' | '[]' | '[)' | '(]' = '[]'
) {
  const minCheck = inclusivity[0] === '[' ? x >= minimum : x > minimum;
  const maxCheck = inclusivity[1] === ']' ? x <= maximum : x < maximum;
  return minCheck && maxCheck;
}

/**
 * Converts a number to a hexadecimal string.
 *
 * @param x - The number to convert
 * @param pad - The number of digits to pad the output with (default: 2)
 * @returns The hexadecimal representation of the number
 *
 * @example
 * ```typescript
 * toHEX(255) // => "ff"
 * toHEX(255, 4) // => "00ff"
 * ```
 */
export function toHex(x: number, pad = 2): string {
  return x.toString(16).padStart(pad, '0');
}
