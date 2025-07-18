import { catchArgs } from "./catchArgs";
import { stringifyError } from "./stringifyError";
export type StringLike = string | { toString(): string };

export type Reason = string | ReadonlyArray<string> | Error;

/** DIE with template string or error or normal string */
export default DIE;

export function DIEError(reason?: Reason, ...slots: StringLike[]): never {
  throw new Error(stringifyError(reason, ...slots));
}

export function DIE(reason?: Reason, ...slots: StringLike[]): never {
  throw errorFormat(reason, ...slots);
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

function errorFormat(reason?: Reason, ...slots: StringLike[]) {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason)) {
    return reason.map((e, i) => e + (slots[i] ?? "")).join("");
  }
  return reason;
}

export { catchArgs };
