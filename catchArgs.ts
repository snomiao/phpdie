/**
 * Attach args into error's {cause} when fn dies
 *
 * Usage:
 *
 * fn2 = catchArgs(fn1)
 *
 * when fn1(1,2,3) dies => print Error: XXX
 *
 * when fn2(1,2,3) dies => print Error: XXX, cause: { args: [1,2,3]}
 *
 */
export function catchArgs<F extends (...args: any[]) => any>(fn: F): F {
  return ((...args) => {
    try {
      const r = fn(...args);
      const isPromise = typeof r.then === "function";
      return !isPromise
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
