import { describe, expect, it } from "vitest";
import {
  camel,
  capitalize,
  dash,
  pascal,
  snake,
  template,
  title,
  trim,
} from "~/utils";

describe("String utilities", () => {
  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("va va voom")).toBe("Va va voom");
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("")).toBe("");
      expect(capitalize("a")).toBe("A");
    });
  });

  describe("camel", () => {
    it("should convert to camelCase", () => {
      expect(camel("hello world")).toBe("helloWorld");
      expect(camel("va va-VOOM")).toBe("vaVaVoom");
      expect(camel("helloWorld")).toBe("helloWorld"); // Already camelCase
      expect(camel("hello_world")).toBe("helloWorld");
      expect(camel("hello.world")).toBe("helloWorld");
      expect(camel("")).toBe("");
      expect(camel("hello")).toBe("hello");
    });
  });

  describe("snake", () => {
    it("should convert to snake_case", () => {
      expect(snake("hello world")).toBe("hello_world");
      expect(snake("va va-VOOM")).toBe("va_va_voom");
      expect(snake("helloWorld")).toBe("hello_world");
      expect(snake("hello.world")).toBe("hello_world");
      expect(snake("")).toBe("");
      expect(snake("hello")).toBe("hello");
    });

    it("should handle splitOnNumber option", () => {
      // Test the actual behavior of splitOnNumber option
      expect(snake("b4Test")).toBe("b_4_test"); // default behavior
      expect(snake("hello2World3test")).toBe("hello_2_world3test");
      // Note: splitOnNumber: false still splits on some patterns
      expect(snake("b4Test", { splitOnNumber: false })).toBe("b4_test");
    });
  });

  describe("dash", () => {
    it("should convert to dash-case", () => {
      expect(dash("hello world")).toBe("hello-world");
      expect(dash("va va_VOOM")).toBe("va-va-voom");
      expect(dash("helloWorld")).toBe("hello-world");
      expect(dash("hello.world")).toBe("hello-world");
      expect(dash("")).toBe("");
      expect(dash("hello")).toBe("hello");
    });
  });

  describe("pascal", () => {
    it("should convert to PascalCase", () => {
      expect(pascal("hello world")).toBe("HelloWorld");
      expect(pascal("va va boom")).toBe("VaVaBoom");
      expect(pascal("hello-world")).toBe("HelloWorld");
      expect(pascal("hello_world")).toBe("HelloWorld");
      expect(pascal("")).toBe("");
      expect(pascal("hello")).toBe("Hello");
    });
  });

  describe("title", () => {
    it("should convert to Title Case", () => {
      expect(title("hello world")).toBe("Hello World");
      expect(title("va_va_boom")).toBe("Va Va Boom");
      expect(title("root-hook")).toBe("Root Hook");
      expect(title("queryItems")).toBe("Query Items");
      expect(title("")).toBe("");
      expect(title(null)).toBe("");
      expect(title(undefined)).toBe("");
    });
  });

  describe("template", () => {
    it("should replace template variables", () => {
      expect(template("Hello, {{name}}", { name: "ray" })).toBe("Hello, ray");
      expect(
        template("{{greeting}} {{name}}!", { greeting: "Hi", name: "John" })
      ).toBe("Hi John!");
      expect(template("No variables", {})).toBe("No variables");
    });

    it("should work with custom regex", () => {
      const customRegex = /<(.+?)>/g;
      expect(template("Hello, <name>", { name: "ray" }, customRegex)).toBe(
        "Hello, ray"
      );
    });
  });

  describe("trim", () => {
    it("should trim whitespace by default", () => {
      expect(trim("  hello  ")).toBe("hello");
      expect(trim(" hello")).toBe("hello");
      expect(trim("hello ")).toBe("hello");
      expect(trim("hello")).toBe("hello");
    });

    it("should trim custom characters", () => {
      expect(trim("__hello__", "_")).toBe("hello");
      expect(trim("/repos/:owner/:repo/", "/")).toBe("repos/:owner/:repo");
      expect(trim("222222__hello__1111111", "12_")).toBe("hello");
    });

    it("should handle null/undefined", () => {
      expect(trim(null)).toBe("");
      expect(trim(undefined)).toBe("");
      expect(trim("")).toBe("");
    });
  });
});
