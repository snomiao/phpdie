/**
 * Comprehensive test matrix for DIE function
 * Testing all possible usage patterns and edge cases
 */

import DIE, { DIES } from "./index";

describe("DIE Function Test Matrix", () => {

  // ============================================================================
  // PATTERN 1: Plain String Errors
  // ============================================================================
  describe("Pattern 1: DIE(string)", () => {
    it("throws plain string with simple message", () => {
      let err: any;
      try {
        DIE("Simple error message");
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Simple error message");
    });

    it("throws plain string with whitespace trimmed", () => {
      let err: any;
      try {
        DIE("  Error with spaces  ");
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Error with spaces");
    });

    it("works with nullish coalescing (??)", () => {
      let err: any;
      try {
        const value = undefined ?? DIE("Missing value");
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Missing value");
    });

    it("works with logical OR (||)", () => {
      let err: any;
      try {
        const value = false || DIE("Failed condition");
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Failed condition");
    });

    it("does not throw when value exists (??)", () => {
      const value = "exists" ?? DIE("Should not throw");
      expect(value).toEqual("exists");
    });

    it("does not throw when value is truthy (||)", () => {
      const value = "truthy" || DIE("Should not throw");
      expect(value).toEqual("truthy");
    });
  });

  // ============================================================================
  // PATTERN 2: Error Objects
  // ============================================================================
  describe("Pattern 2: DIE(Error)", () => {
    it("throws Error object", () => {
      let err: any;
      try {
        DIE(new Error("Error object message"));
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("Error object message");
    });

    it("throws Error with cause (ES2022)", () => {
      let err: any;
      const cause = { code: "INVALID_INPUT" };
      try {
        DIE(new Error("Main error", { cause }));
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("Main error");
      expect(err.cause).toEqual(cause);
    });

    it("works with nullish coalescing", () => {
      let err: any;
      try {
        const token = process.env.TOKEN ?? DIE(new Error("Missing Token"));
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("Missing Token");
    });

    it("throws custom Error subclasses", () => {
      class CustomError extends Error {
        constructor(message: string, public code: number) {
          super(message);
          this.name = "CustomError";
        }
      }

      let err: any;
      try {
        DIE(new CustomError("Custom error", 404));
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(CustomError);
      expect(err.code).toEqual(404);
    });
  });

  // ============================================================================
  // PATTERN 3: Tagged Template Literals (no interpolation)
  // ============================================================================
  describe("Pattern 3: DIE`template` (no interpolation)", () => {
    it("throws with simple template string", () => {
      let err: any;
      try {
        DIE`Simple template error`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Simple template error");
    });

    it("works with nullish coalescing", () => {
      let err: any;
      try {
        const token = process.env.TOKEN ?? DIE`Missing Token`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Missing Token");
    });

    it("works with logical OR", () => {
      let err: any;
      try {
        const value = false || DIE`Failed condition`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Failed condition");
    });
  });

  // ============================================================================
  // PATTERN 4: Tagged Template Literals (with interpolation)
  // ============================================================================
  describe("Pattern 4: DIE`template ${value}` (with interpolation)", () => {
    it("throws with single interpolated value", () => {
      let err: any;
      const userId = 123;
      try {
        DIE`User ${userId} not found`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("User 123 not found");
    });

    it("throws with multiple interpolated values", () => {
      let err: any;
      const userId = 123;
      const action = "delete";
      try {
        DIE`User ${userId} cannot ${action} this resource`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("User 123 cannot delete this resource");
    });

    it("throws with string interpolation", () => {
      let err: any;
      const expected = "value1";
      const actual = "value2";
      try {
        DIE`Expected ${expected} but got ${actual}`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Expected value1 but got value2");
    });

    it("throws with Error object interpolation", () => {
      let err: any;
      const innerError = new Error("Inner error");
      try {
        DIE`Failed to process: ${innerError}`;
      } catch (e) {
        err = e;
      }
      expect(err).toContain("Failed to process:");
      expect(err).toContain("Inner error");
    });

    it("throws with number and boolean interpolation", () => {
      let err: any;
      const count = 5;
      const isValid = false;
      try {
        DIE`Expected ${count} items, valid: ${isValid}`;
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("Expected 5 items, valid: false");
    });

    it("throws with object interpolation", () => {
      let err: any;
      const obj = { id: 1, name: "test" };
      try {
        DIE`Failed with object: ${obj}`;
      } catch (e) {
        err = e;
      }
      expect(err).toContain("Failed with object:");
      expect(err).toContain("[object Object]");
    });
  });

  // ============================================================================
  // PATTERN 5: Function Call Pattern DIE(fn, ...args)
  // ============================================================================
  describe("Pattern 5: DIE(fn, ...args)", () => {
    it("calls function with single argument", () => {
      const calls: any[][] = [];
      const mockFn = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        DIE(mockFn, "Error message");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Error message"]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIE");
      expect(err.cause).toEqual(["Error message"]);
    });

    it("calls function with multiple arguments", () => {
      const calls: any[][] = [];
      const mockFn = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        DIE(mockFn, "Error:", 404, "Not Found");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Error:", 404, "Not Found"]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIE");
      expect(err.cause).toEqual(["Error:", 404, "Not Found"]);
    });

    it("works with console.error", () => {
      const originalConsoleError = console.error;
      const calls: any[][] = [];
      console.error = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        DIE(console.error, "Console error message");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Console error message"]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIE");

      console.error = originalConsoleError;
    });

    it("works with alert-like functions", () => {
      const calls: any[][] = [];
      const mockAlert = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        false || DIE(mockAlert, "Alert message");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Alert message"]]);
      expect(err).toBeInstanceOf(Error);
    });

    it("works with toast-like functions", () => {
      const calls: any[][] = [];
      const toast = {
        error: (...args: any[]) => calls.push(["error", ...args]),
        success: (...args: any[]) => calls.push(["success", ...args]),
      };
      let err: any;

      try {
        DIE(toast.error, "Toast error");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["error", "Toast error"]]);
      expect(err).toBeInstanceOf(Error);
    });

    it("works with custom error handlers", () => {
      const calls: any[][] = [];
      const customHandler = (msg: string, context?: any) => {
        calls.push([msg, context]);
      };
      let err: any;

      try {
        DIE(customHandler, "Custom error", { code: 500 });
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Custom error", { code: 500 }]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.cause).toEqual(["Custom error", { code: 500 }]);
    });

    it("catches errors from the alert function itself", () => {
      const throwingFn = () => {
        throw new Error("Alert function failed");
      };
      let err: any;

      try {
        DIE(throwingFn, "Message");
      } catch (e) {
        err = e;
      }

      // Should throw DIE error, not the alert function error
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIE");
    });

    it("works with arrow functions", () => {
      const calls: any[] = [];
      let err: any;

      try {
        DIE(() => calls.push("called"), "arg1");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual(["called"]);
      expect(err).toBeInstanceOf(Error);
    });
  });

  // ============================================================================
  // PATTERN 6: Edge Cases
  // ============================================================================
  describe("Pattern 6: Edge Cases", () => {
    it("throws undefined when called with no arguments", () => {
      let err: any;
      let caught = false;
      try {
        (DIE as any)();
      } catch (e) {
        err = e;
        caught = true;
      }
      expect(caught).toBe(true);
      expect(err).toBeUndefined();
    });

    it("throws null when called with null", () => {
      let err: any;
      let caught = false;
      try {
        DIE(null as any);
      } catch (e) {
        err = e;
        caught = true;
      }
      expect(caught).toBe(true);
      expect(err).toBeNull();
    });

    it("throws empty string when called with empty string", () => {
      let err: any;
      try {
        DIE("");
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("");
    });

    it("throws number when called with number", () => {
      let err: any;
      try {
        DIE(404 as any);
      } catch (e) {
        err = e;
      }
      expect(err).toEqual(404);
    });

    it("does NOT treat single function argument as function pattern", () => {
      // DIE(fn) without additional args should throw the function, not call it
      const fn = () => "test";
      let err: any;
      try {
        DIE(fn as any);
      } catch (e) {
        err = e;
      }
      // Should throw the function itself
      expect(typeof err).toBe("function");
    });
  });

  // ============================================================================
  // LEGACY PATTERN: DIES (deprecated)
  // ============================================================================
  describe("Legacy: DIES function (deprecated)", () => {
    it("calls alert function and throws error", () => {
      const calls: any[][] = [];
      const mockAlert = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        DIES(mockAlert, "Error message");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Error message"]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIES");
      expect(err.cause).toEqual(["Error message"]);
    });

    it("works with multiple arguments", () => {
      const calls: any[][] = [];
      const mockAlert = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        DIES(mockAlert, "Error:", 404, "Not Found");
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([["Error:", 404, "Not Found"]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIES");
    });

    it("works with no additional arguments", () => {
      const calls: any[][] = [];
      const mockAlert = (...args: any[]) => calls.push(args);
      let err: any;

      try {
        DIES(mockAlert);
      } catch (e) {
        err = e;
      }

      expect(calls).toEqual([[]]);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("DIES");
      expect(err.cause).toEqual([]);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS: Real-world usage patterns
  // ============================================================================
  describe("Integration: Real-world usage patterns", () => {
    it("environment variable validation", () => {
      let err: any;
      try {
        const apiKey = process.env.NON_EXISTENT_VAR ?? DIE("API key is required");
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("API key is required");
    });

    it("function parameter validation", () => {
      function processUser(userId: string | null) {
        userId || DIE("User ID is required");
        return `Processing user ${userId}`;
      }

      expect(() => processUser(null)).toThrow();
      expect(processUser("123")).toEqual("Processing user 123");
    });

    it("array element access", () => {
      const items = [1, 2, 3];
      let err: any;
      try {
        const item = items[10] ?? DIE`Item at index ${10} not found`;
      } catch (e) {
        err = e;
      }
      expect(err).toContain("Item at index 10 not found");
    });

    it("API response validation", () => {
      const mockResponse = { status: 404, data: null };
      let err: any;

      try {
        const data = mockResponse.data ?? DIE(new Error(`API error: ${mockResponse.status}`));
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain("404");
    });

    it("form validation with toast notifications", () => {
      const toastCalls: string[] = [];
      const toast = {
        error: (msg: string) => toastCalls.push(msg),
      };

      function validateForm(email: string, password: string) {
        email.trim() || DIE(toast.error, "Email is required");
        password.trim() || DIE(toast.error, "Password is required");
        password.length >= 8 || DIE(toast.error, "Password must be at least 8 characters");
        return { email, password };
      }

      expect(() => validateForm("", "pass")).toThrow();
      expect(toastCalls).toContain("Email is required");

      toastCalls.length = 0;
      expect(() => validateForm("test@example.com", "short")).toThrow();
      expect(toastCalls).toContain("Password must be at least 8 characters");

      toastCalls.length = 0;
      const result = validateForm("test@example.com", "password123");
      expect(result.email).toEqual("test@example.com");
      expect(toastCalls).toEqual([]);
    });
  });

  // ============================================================================
  // TYPE SAFETY TESTS (compile-time verification)
  // ============================================================================
  describe("Type Safety: Compile-time checks", () => {
    it("return type is never", () => {
      // This test verifies that TypeScript knows DIE never returns
      function test(): string {
        const value = process.env.VALUE;
        if (!value) {
          DIE("Value required");
          // TypeScript should know this line is unreachable
        }
        return value; // No error because TypeScript knows value is string here
      }

      expect(() => test()).toThrow();
    });

    it("works in type narrowing", () => {
      function processValue(value: string | null): string {
        value ?? DIE("Value cannot be null");
        // TypeScript narrows value to string here
        return value.toUpperCase();
      }

      expect(() => processValue(null)).toThrow();
      expect(processValue("test")).toEqual("TEST");
    });
  });
});
