export default function DIE(reason?: string | Error): never {
  if (typeof reason === "string") {
    globalThis?.window?.alert?.( reason )
    throw reason.trim();
  }
  throw reason;
}
