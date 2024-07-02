type Reason = string | ReadonlyArray<string> | Error;

export default function DIE(reason?: Reason, ...slots: string[]) {
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
function throwsError(reason?: Reason, ...slots: string[]) {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason)) {
    return reason.map((e, i) => e + (slots[i] ?? "")).join("");
  }
  return reason;
}
function stringifyError(reason?: Reason, ...slots: string[]) {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason)) {
    return reason.map((e, i) => e + (slots[i] ?? "")).join("");
  }
  return String((reason instanceof Error && reason.message) || reason);
}
