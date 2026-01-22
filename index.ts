import tsaComposer from "tsa-composer";
import { catchArgs } from "./catchArgs";
import { stringifyError } from "./stringifyError";

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
 */
export function DIE(message: string): never;

/**
 * Throw with Error object
 */
export function DIE(error: Error): never;

/**
 * Throw with alert/toast function - calls the function then throws
 */
export function DIE<Fn extends (...args: any[]) => any>(
  alertFn: Fn,
  ...args: Parameters<Fn>
): never;

/**
 * Throw with tagged template literal
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
  if (typeof first === 'object' && first && Array.isArray(first) && 'raw' in first) {
    return DIETagged(first as TemplateStringsArray, ...rest);
  }

  // Handle Error object: DIE(new Error(...))
  if (first instanceof Error) {
    throw first;
  }

  // Handle alert/toast function pattern: DIE(fn, ...args)
  // Must check this before string check, as functions are also objects
  if (typeof first === 'function' && rest.length > 0) {
    try {
      first(...rest);
    } catch (fnError) {
      // If the alert function itself throws, ignore it
    }
    throw new Error('DIE', { cause: rest });
  }

  // Handle plain string: DIE("message")
  if (typeof first === 'string') {
    throw new Error(first.trim());
  }

  // Fallback: throw undefined or the value
  throw first;
}

/** DIE with template string or error or normal string */
export default DIE;

/** @deprecated DIE(...) always throws Error Object now */
export function DIEError(reason?: Reason, ...slots: StringLike[]): never {
  throw new Error(stringifyError(reason, ...slots));
}

/**
 * Die with string, this is the same as DIE but with a different name.
 *
 * allow use toast.error or alert to show the error message
 * @param alert - function to show the error message, could be `alert`, `console.error`, `toast.error`, or any other function that accepts a string.
 * @deprecated DIE() now supports this usage directly, use || DIE(toast.error, 'YOUR ERROR MESSAGE') instead
 */
export function DIES<Args extends unknown[]>(alert: (...args: readonly [...Args]) => any, ...args: readonly [...Args]): never {
  alert(...args);
  throw new Error('DIES', { cause: args });
}

/**
 * show an alert with the error message and stop current function.
 *
 * @deprecated Use || DIE(alert, 'YOUR ERROR MESSAGE') instead
 */
export const DIEAlert = (...args: any[]) => {
  if (typeof args[0] === 'string') {
    alert(args[0]);
  }
  DIE(...args);
};

/**
 * print error and exit process with code 1.
 *
 * @deprecated Use || DIE(console.error, 'ERROR') instead
 */
export const DIEProcess = (...args: any[]) => {
  console.error(...args);
  process.exit(1);
}

export { catchArgs };
