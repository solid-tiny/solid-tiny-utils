import type { JSX } from "solid-js/jsx-runtime";
import { describe, expect, it } from "vitest";
import { combineStyle } from "~/dom";

describe("combineStyle", () => {
  it("should combine two style objects", () => {
    const styleA: JSX.CSSProperties = { color: "red", "font-size": "12px" };
    const styleB: JSX.CSSProperties = {
      "background-color": "blue",
      "font-size": "14px",
    };
    const combined = combineStyle(styleA, styleB);
    expect(combined).toEqual({
      color: "red",
      "font-size": "14px",
      "background-color": "blue",
    });
  });

  it("should handle string styles", () => {
    const styleA: JSX.CSSProperties = { color: "red", "font-size": "12px" };
    const styleB = "background-color: blue; font-size: 14px;";
    const combined = combineStyle(styleA, styleB);
    expect(combined).toEqual({
      color: "red",
      "font-size": "14px",
      "background-color": "blue",
    });
  });

  it("should ignore undefined or null styles", () => {
    const styleA: JSX.CSSProperties = { color: "red", "font-size": "12px" };
    const styleB = undefined;
    const combined = combineStyle(styleA, styleB);
    expect(combined).toEqual(styleA);
  });
});
