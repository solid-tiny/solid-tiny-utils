import { clamp, isArray, toHex } from "~/utils";
import type { RGB } from "./oklch-rgb";

// Pre-compiled regex patterns for performance
const HEX_PREFIX_REGEX = /^#/;
const HEX_VALIDATION_REGEX = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a hex color string to RGB color values.
 *
 * Supports both 3-digit (#rgb) and 6-digit (#rrggbb) hex formats.
 * The hash symbol (#) is optional.
 *
 * @param hex - Hex color string (e.g., "#ffcc00", "ffcc00", "#fc0", "fc0")
 * @returns RGB object with r, g, b values (0-255), or null if invalid
 *
 * @example
 * ```typescript
 * hexToRgb("#ffcc00") // => { r: 255, g: 204, b: 0 }
 * hexToRgb("fc0")     // => { r: 255, g: 204, b: 0 }
 * hexToRgb("#invalid") // => null
 * ```
 */
export function hexToRgb(hex: string): RGB | null {
  if (!hex || typeof hex !== "string") {
    return null;
  }

  // Clean and normalize the hex string
  let value = hex.trim().replace(HEX_PREFIX_REGEX, "");

  // Handle 3-digit hex (e.g., "f0c" -> "ff00cc")
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Validate hex format
  if (!HEX_VALIDATION_REGEX.test(value)) {
    return null;
  }

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return { r, g, b };
}

/**
 * Converts RGB color values to a hex color string.
 *
 * RGB values are automatically clamped to the 0-255 range.
 *
 * @param rgb - RGB object with r, g, b values
 * @returns Hex color string with # prefix (e.g., "#ffcc00")
 *
 * @example
 * ```typescript
 * rgbToHex({ r: 255, g: 204, b: 0 }) // => "#ffcc00"
 * rgbToHex({ r: 300, g: -10, b: 128 }) // => "#ff0080" (clamped values)
 * ```
 */
export function rgbToHex(rgb: RGB | [number, number, number]): string {
  const c = (v: number) => Math.round(clamp(v, 0, 255));

  const rgb_ = isArray(rgb) ? rgb : [rgb.r, rgb.g, rgb.b];

  const r = c(rgb_[0]);
  const g = c(rgb_[1]);
  const b = c(rgb_[2]);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
