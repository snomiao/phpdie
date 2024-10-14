import { catchArgs } from "./catchArgs";
type StringLike = string | { toString(): string };

type Reason = string | ReadonlyArray<string> | Error;
/** Die with string */
export default DIE;

export function DIEError(reason?: Reason, ...slots: StringLike[]): never {
  throw new Error(stringifyError(reason, ...slots));
}
export function DIE(reason?: Reason, ...slots: StringLike[]): never {
  throw throwsError(reason, ...slots);
}
export const DIEAlert: typeof DIE = (...args) => {
  alert(stringifyError(...args));
  DIE(...args);
};
export const DIEProcess: typeof DIE = (...args) => {
  console.error(stringifyError(...args));
  process.exit(1);
};

function throwsError(reason?: Reason, ...slots: StringLike[]) {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason)) {
    return reason.map((e, i) => e + (slots[i] ?? "")).join("");
  }
  return reason;
}
function stringifyError(reason?: Reason, ...slots: StringLike[]) {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason)) {
    return reason.map((e, i) => e + (slots[i]?.toString() ?? "")).join("");
  }
  return String((reason instanceof Error && reason.message) || reason);
}

export { catchArgs };
