import tsaComposer from "tsa-composer";
import { catchArgs } from "./catchArgs";

export type StringLike = string | { toString(): string };
export type Reason = string | ReadonlyArray<string> | Error;

/**
 * Custom parser for DIE tagged templates that joins strings and interpolated values
 */
const dieParser = (tsa: TemplateStringsArray, ...slots: (StringLike | Error)[]): [string] => {
  // Join template strings with interpolated values
  let result = "";
  for (let i = 0; i < tsa.length; i++) {
    result += tsa[i];
    if (i < slots.length) {
      const slot = slots[i];
      result += slot instanceof Error ? slot.message : String(slot);
    }
  }
  return [result];
};

/**
 * Core DIE implementation using tsa-composer for tagged template literals
 * Provides type-safe tagged template literal support
 */
const DIETagged = tsaComposer(dieParser)((message: string): never => {
  throw new Error(message.trim());
});

// TypeScript overloads for different usage patterns
/**
 * Throw with plain string message
 * @example DIE("This is an error message");
 */
export function DIE(message: string): never;

/**
 * Throw with Error object
 * @example DIE(new Error("This is an error message"));
 */
export function DIE(error: Error): never;

/**
 * Throw with alert/toast function - calls the function then throws
 * @example DIE(alert, "This is an error message with alert");
 */
export function DIE<Fn extends (message: string, ...args: any[]) => any>(
  fn: Fn,
  ...args: Parameters<Fn>
): never;

/**
 * Throw with tagged template literal
 * @example DIE`This is an error with value ${value}`;
 */
export function DIE(tsa: TemplateStringsArray, ...slots: any[]): never;

/**
 * Die with template string or error or normal string
 *
 * @example
 * // Tagged template literal
 * DIE`This is an error`;
 * DIE`User ${userId} cannot ${action} this resource`;
 * DIE`Operation failed: ${error?.message || 'Unknown error'}`;
 *
 * // Error object, with meta info support (ES2022+)
 * DIE(new Error("This is an error"));
 * DIE(new Error("This is an error", { cause: someCause }));
 *
 * // Plain string, will be wrapped in Error object
 * DIE("This is an error message");
 *
 * // With nullish coalescing
 * const token = process.env.TOKEN ?? DIE("Missing Token");
 *
 * // Tap by toast/alert/modal error function and throw, all args will be passed to the function, and then throw an Error
 * DIE(alert, "This is an error message with alert");
 * DIE(toast.error, "This is an error message with alert");
 * DIE(showErrorModal, "This is an error message with alert");
 *
 * // With logical OR (PHP-style)
 * const config = loadConfig() || DIE("Failed to load config");
 */
export function DIE(...args: any[]): never {
  const [first, ...rest] = args;

  // Handle tagged template literals - when called with TemplateStringsArray
  // signature: DIE`template string ${value}`
  if (typeof first === "object" && first && Array.isArray(first) && "raw" in first) {
    return DIETagged(first as TemplateStringsArray, ...rest);
  }

  // Handle Error object: DIE(new Error(...))
  // signature: DIE(Error)
  if (first instanceof Error) {
    throw first;
  }

  // Handle alert/toast function pattern: DIE(fn, ...args)
  // Must check this before string check, as functions are also objects
  // signature: DIE(alertFunction, arg1, arg2, ...)
  if (typeof first === "function" && rest.length > 0) {
    const fn = first as (message: string, ...args: any[]) => any;
    const message = String(rest[0]);
    let errorCause: unknown[] = [];
    try {
      fn(...(rest as Parameters<typeof fn>));
    } catch (fnError) {
      // If the alert/toast/modal function itself throws, record it and attach to the new Error
      errorCause.push(fnError);
    }
    throw new Error(
      message,
      errorCause.length > 0 ? { cause: errorCause.length === 1 ? errorCause[0] : errorCause } : {},
    );
  }

  // Handle plain string: DIE("message")
  // signature: DIE(string)
  if (typeof first === "string") {
    throw new Error(first.trim());
  }

  // Fallback: throw undefined or the value, should not reach here normally
  throw first;
}

/** DIE with template string or error or normal string */
export default DIE;

// Re-export deprecated functions for backward compatibility
export { DIEError, DIES, DIEAlert, DIEProcess } from "./deprecated";

export { catchArgs };
