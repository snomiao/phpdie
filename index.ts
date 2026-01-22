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
  throw message.trim();
});

/**
 * Die with template string or error or normal string
 *
 * @example
 * // Tagged template literal
 * DIE`This is an error with value: ${value}`;
 *
 * // Tagged template with interpolated values
 * DIE`User ${userId} cannot ${action} this resource`;
 *
 * // Error object
 * DIE(new Error("This is an error"));
 *
 * // Plain string
 * DIE("This is an error message");
 *
 * // With nullish coalescing
 * const token = process.env.TOKEN ?? DIE("Missing Token");
 *
 * // With logical OR (PHP-style)
 * const config = loadConfig() || DIE("Failed to load config");
 */
export function DIE(reason?: Reason, ...slots: StringLike[]): never {
  // Handle tagged template literals - when called with TemplateStringsArray
  if (typeof reason === 'object' && reason && Array.isArray(reason) && 'raw' in reason) {
    return DIETagged(reason as TemplateStringsArray, ...slots as any[]);
  }

  // Handle direct function calls
  throw errorFormat(reason, ...slots);
}

/** DIE with template string or error or normal string */
export default DIE;

/** @deprecated use DIE(new Error(...))  */
export function DIEError(reason?: Reason, ...slots: StringLike[]): never {
  throw new Error(stringifyError(reason, ...slots));
}

/**
 * Die with string, this is the same as DIE but with a different name.
 *
 * allow use toast.error or alert to show the error message
 * @param alert - function to show the error message, could be `alert`, `console.error`, `toast.error`, or any other function that accepts a string.
 */
export function DIES<Args extends unknown[]>(alert: (...args: readonly [...Args]) => any, ...args: readonly [...Args]): never {
  alert(...args);
  throw new Error('DIES', { cause: args });
}

/**
 * show an alert with the error message and stop current function.
 *
 * @deprecated Use || DIES(alert, 'YOUR ERROR MESSAGE') instead
 */
export const DIEAlert: typeof DIE = (...args) => {
  alert(stringifyError(...args));
  DIE(...args);
};

/**
 * print error and exit process with code 1.
 *
 * @deprecated Use || DIES(()=> process.exit(1), console.error('ERROR')) instead
 */
export const DIEProcess: typeof DIE = (...args) => {
  console.error(stringifyError(...args));
  process.exit(1);
}

/**
 * Formats error output based on the reason type
 * Handles strings, template string arrays, and Error objects
 */
function errorFormat(reason?: Reason, ...slots: StringLike[]): string | Error | undefined {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason) && typeof reason[0] === "string") {
    // Template string array - join with slots
    return reason.map((e, i) => e + (slots[i] ?? "")).join("");
  }
  return reason as Error | undefined;
}

export { catchArgs };
