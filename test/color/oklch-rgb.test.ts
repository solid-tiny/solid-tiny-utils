// tests/oklch-rgb.spec.ts

import { rgb as culoriRgb, oklch } from 'culori';
import { describe, expect, it } from 'vitest';
import { isValidOKLCH, isValidRGB, oklchToRgb, rgbToOklch } from '~/color';
import { clamp } from '~/utils';

// ---------- Helper: convert culori RGB (0-1) to 0-255 ----------
function culoriRgbTo255(c: Exclude<ReturnType<typeof culoriRgb>, undefined>) {
  return {
    r: Math.round(clamp(c.r * 255, 0, 255)),
    g: Math.round(clamp(c.g * 255, 0, 255)),
    b: Math.round(clamp(c.b * 255, 0, 255)),
  };
}

// ---------- Test data ----------
const testColors = [
  { l: 0.0, c: 0.0, h: 0 },
  { l: 1.0, c: 0.0, h: 0 },
  { l: 0.5, c: 0.0, h: 0 },
  { l: 0.7, c: 0.1, h: 200 },
  { l: 0.3, c: 0.5, h: 90 },
  { l: 0.9, c: 0.2, h: 330 },
  { l: 0.6, c: 0.8, h: 45 },
  { l: 0.4, c: 0.0, h: 120 },
];

describe('OKLCH ↔ RGB implementation matches culori', () => {
  for (const color of testColors) {
    it(`OKLCH(${color.l}, ${color.c}, ${color.h}) → RGB`, () => {
      // Convert using our implementation
      const ours = oklchToRgb(color);

      // Convert using culori
      const cColor = oklch({
        ...color,
        mode: 'oklch',
      });
      const cRgb255 = culoriRgbTo255(culoriRgb(cColor));

      // Compare results
      expect(ours).toEqual(cRgb255);
    });

    it(`RGB → OKLCH(${color.l}, ${color.c}, ${color.h})`, () => {
      // Convert to RGB first
      const rgbVal = oklchToRgb(color);

      // Convert back to OKLCH using our implementation
      const okLchBack = rgbToOklch(rgbVal);

      // Convert using culori for comparison
      const culoriBack = oklch(
        culoriRgb({
          mode: 'rgb',
          r: rgbVal.r / 255,
          g: rgbVal.g / 255,
          b: rgbVal.b / 255,
        })
      );

      // Compare L, C, H with small tolerance
      const tolerance = 1e-5;
      const hue_tolerance = 1e-4; // Slightly higher tolerance for hue due to floating-point precision
      expect(Math.abs(okLchBack.l - culoriBack.l)).toBeLessThan(tolerance);
      expect(Math.abs(okLchBack.c - culoriBack.c)).toBeLessThan(tolerance);

      // For achromatic colors (very small chroma), hue is meaningless
      if (okLchBack.c > 1e-6 && (culoriBack.c ?? 0) > 1e-6) {
        const hueDiff = Math.abs(okLchBack.h - (culoriBack.h ?? 0));
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
        expect(normalizedHueDiff).toBeLessThan(hue_tolerance);
      }
    });
  }
});

describe('Input validation and edge cases', () => {
  it('should handle out-of-range OKLCH values gracefully', () => {
    // Test negative lightness
    const result1 = oklchToRgb({ l: -0.1, c: 0.1, h: 100 });
    expect(isValidRGB(result1)).toBe(true);

    // Test lightness > 1
    const result2 = oklchToRgb({ l: 1.5, c: 0.1, h: 100 });
    expect(isValidRGB(result2)).toBe(true);

    // Test negative chroma (should be clamped to 0)
    const result3 = oklchToRgb({ l: 0.5, c: -0.1, h: 100 });
    expect(isValidRGB(result3)).toBe(true);

    // Test hue normalization
    const result4 = oklchToRgb({ l: 0.5, c: 0.1, h: 450 }); // 450° = 90°
    const result5 = oklchToRgb({ l: 0.5, c: 0.1, h: 90 });
    expect(result4).toEqual(result5);

    const result6 = oklchToRgb({ l: 0.5, c: 0.1, h: -90 }); // -90° = 270°
    const result7 = oklchToRgb({ l: 0.5, c: 0.1, h: 270 });
    expect(result6).toEqual(result7);
  });

  it('should handle out-of-range RGB values gracefully', () => {
    // Test negative RGB values
    const result1 = rgbToOklch({ r: -10, g: 50, b: 100 });
    expect(isValidOKLCH(result1)).toBe(true);

    // Test RGB values > 255
    const result2 = rgbToOklch({ r: 300, g: 50, b: 100 });
    expect(isValidOKLCH(result2)).toBe(true);
  });
});
