# Die

`|| DIE('reason')` Throws an error like PHP's `or DIE('REASON')`, Simple error throwing in a functional dev.

## Usage

```js
import DIE from '@snomiao/die'
const token = process.env.TOKEN ?? DIE("Missing Token")

console.log(token)


```

## Reference

### spec

```js
import DIE from ".";

it("lives", () => {
  const token = "123" ?? DIE("Missing Token");
  console.log(token);
  expect(token).toEqual("123");
});

it("dies", () => {
  let err: any;
  try {
    const token = process.env.TOKEN ?? DIE("Missing Token");
    console.log(token);
  } catch (e) {
    err = e;
  }
  expect(err).toEqual("Missing Token");
});

it("dies with error", () => {
  let err: any;
  try {
    const token = process.env.TOKEN ?? DIE(new Error("Missing Token"));
    console.log(token);
  } catch (e) {
    err = e;
  }
  expect(err.message).toEqual("Missing Token");
});


```

### Impl

```ts
export function DIE(reason?: string | Error): never {
    if (typeof reason === "string") {
        const err = new Error(reason);
        throw err.stack;
    }
    throw reason;
}
```