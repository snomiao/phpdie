type Reason = string | ReadonlyArray<string> | Error;
export default function DIE(reason?: Reason): never {
  if (typeof reason === "string") {
    throw reason.trim();
  }
  throw reason;
}
export function DIEAlert(reason?: Reason): never {
  alert(String((reason instanceof Error && reason.message) || reason));
  DIE(reason);
}
