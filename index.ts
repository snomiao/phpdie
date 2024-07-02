export default function DIE(
  reason?: string | ReadonlyArray<string> | Error,
  ...slots: string[]
): never {
  if (typeof reason === "string") {
    throw reason.trim();
  }
  if (Array.isArray(reason)) {
    throw reason.map((e, i) => e + (slots[i] ?? "")).join("");
  }
  throw reason;
}
export function DIEAlert(reason?: string | Error): never {
  alert(String((reason instanceof Error && reason.message) || reason));
  DIE(reason);
}
export function DIEProcess(reason?: string | Error): never {
  console.error(reason);
  process.exit(1);
}
