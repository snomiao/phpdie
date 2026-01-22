/**
 * Deprecated functions for backward compatibility
 * These functions are kept for legacy support but are no longer recommended
 */

import DIE from "./index";
import { stringifyError } from "./stringifyError";
import type { Reason, StringLike } from "./index";

/**
 * @deprecated DIE(...) always throws Error Object now
 * Use DIE(new Error(...)) instead
 */
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
export function DIES<Args extends unknown[]>(
  alert: (...args: readonly [...Args]) => any,
  ...args: readonly [...Args]
): never {
  alert(...args);
  throw new Error("DIES", { cause: args });
}

/**
 * show an alert with the error message and stop current function.
 *
 * @deprecated Use || DIE(alert, 'YOUR ERROR MESSAGE') instead
 */
export const DIEAlert = (...args: any[]): never => {
  if (typeof args[0] === "string") {
    alert(args[0]);
  }
  return DIE(...(args as [any]));
};

/**
 * print error and exit process with code 1.
 *
 * @deprecated Use || DIE(console.error, 'ERROR') instead
 */
export const DIEProcess = (...args: any[]): never => {
  console.error(...args);
  process.exit(1);
};
