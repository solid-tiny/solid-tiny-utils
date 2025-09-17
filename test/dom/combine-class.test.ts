/** biome-ignore-all lint/suspicious/noExplicitAny: test */
import { describe, expect, it } from "vitest";
import { combineClass } from "~/dom";

describe("combineClass", () => {
  it("should combine two class names", () => {
    const classA = "class-a";
    const classB = "class-b";
    const combined = combineClass(classA, classB);
    expect(combined).toBe("class-a class-b");
  });

  it("should ignore falsy values", () => {
    const classA = "class-a";
    const classB = "";
    const combined = combineClass(classA, classB);
    expect(combined).toBe("class-a");
  });

  it("should handle multiple class names", () => {
    const classA = "class-a";
    const classB = "class-b";
    const classC = "class-c";
    const combined = combineClass(classA, classB, classC);
    expect(combined).toBe("class-a class-b class-c");
  });

  it("should return empty string if all classes are falsy", () => {
    const combined = combineClass("", null as any, undefined as any);
    expect(combined).toBe("");
  });
});
