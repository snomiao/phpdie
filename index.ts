export default function DIE(reason?: string | Error): never {
  if (typeof reason === "string") {
    throw reason.trim();
  }
  throw reason;
}
export function DIEAlert(reason?: string | Error): never {
  alert(String(reason instanceof Error && reason.message || reason))
  DIE(reason)
}