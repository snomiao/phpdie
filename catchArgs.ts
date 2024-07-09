import yaml from "yaml";
import { DIE } from ".";
import { isPromise } from "util/types";
/** Attach args into cause info when fn dies */
export function catchArgs<F extends (...args: any[]) => any>(fn: F): F {
  return ((...args) => {
    try {
      const r = fn(...args);
      return !isPromise(r)
        ? r
        : (async function () {
            return await r;
          })().catch((error) => handleError(error, args));
    } catch (error) {
      handleError(error, args);
    }
  }) as F;
}
function handleError(error: unknown, args: any[]) {
  if (error instanceof Error) {
    throw Object.assign(error, {
      cause: {
        ...((typeof error.cause === "object" && error.cause) || null),
        ...((typeof error.cause === "string" && { cause: error.cause }) ||
          null),
        args,
      },
    });
  }
}
