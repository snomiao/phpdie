import type { Reason, StringLike } from ".";

export function stringifyError(reason?: Reason, ...slots: StringLike[]) {
  if (typeof reason === "string") {
    return reason.trim();
  }
  if (Array.isArray(reason)) {
    return reason.map((e, i) => e + (slots[i]?.toString() ?? "")).join("");
  }
  return String((reason instanceof Error && reason.message) || reason);
}
