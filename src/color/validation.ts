import { inRange } from '~/utils';
import { hexToRgb } from './hex-rgb';
import type { OKLCH, RGB } from './oklch-rgb';

/**
 * Checks if RGB values are in valid range (0-255)
 */
export function isValidRGB(rgb: RGB): boolean {
  return Object.values(rgb).every((x) => inRange(x, 0, 255));
}

/**
 * Checks if OKLCH values are in valid ranges
 */
export function isValidOKLCH(oklch: OKLCH): boolean {
  return inRange(oklch.l) && oklch.c >= 0 && inRange(oklch.h, 0, 360);
}

/**
 * Checks if a string is a valid hex color format.
 *
 * @param hex - String to validate
 * @returns `true` if the string is a valid hex color, `false` otherwise
 *
 * @example
 * ```typescript
 * isValidHex("#ffcc00") // => true
 * isValidHex("fc0")     // => true
 * isValidHex("#invalid") // => false
 * ```
 */
export function isValidHex(hex: string): boolean {
  return hexToRgb(hex) !== null;
}
