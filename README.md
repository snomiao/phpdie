# PHPDIE aka @snomiao/die

`|| DIE('reason')` Throws an error like PHP's `or DIE('REASON')`, Simple error throwing in a functional dev.

## Usage

```js
import DIE from 'phpdie'
const token = process.env.TOKEN ?? DIE("Missing Token")

console.log(token) // typeof token === "string"


```

## DIES Function

The `DIES` function allows you to call an alert function (like `alert`, `console.error`, `toast.error`, etc.) and then throw an error. This is useful for showing error messages to users before terminating execution.

```js
import { DIES } from '@snomiao/die'

const ooops = false!

// With alert
ooops || DIES(alert, "Something went wrong!");

// With console.error
ooops || DIES(console.error, "Error:", 404, "Not Found");

// With toast notifications
ooops || DIES(toast.error, "Failed to save data");

// With custom alert function
const showError = (msg) => { /* show error in UI */ };
ooops || DIES(showError, "Custom error message");

ooops || DIES(()=> 'anyway die');

```

The `DIES` function:
- Calls the provided alert function with the given arguments
- Throws an Error with message "DIES" and the arguments stored in the `cause` property
- Never returns (return type is `never`)

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
