# phpdie

> Throw errors like PHP's `or die('reason')` - Simple, functional error handling for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/phpdie.svg)](https://www.npmjs.com/package/phpdie)
[![npm downloads](https://img.shields.io/npm/dm/phpdie.svg)](https://www.npmjs.com/package/phpdie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Also published as [`@snomiao/die`](https://www.npmjs.com/package/@snomiao/die)

## Why?

Traditional error handling breaks functional pipelines and requires verbose try-catch blocks. `phpdie` brings PHP's `or die()` pattern to JavaScript/TypeScript, letting you handle errors inline with proper type narrowing.

```ts
// Before: verbose and breaks the flow
let token: string | undefined = process.env.TOKEN;
if (!token) {
  throw new Error("Missing Token");
}
console.log(token); // TypeScript still thinks token might be undefined

// After: clean and type-safe
const token = process.env.TOKEN ?? DIE("Missing Token");
console.log(token); // TypeScript knows token is string
```

## Installation

```bash
npm install phpdie
# or
bun add phpdie
# or
yarn add phpdie
```

## Usage

### Basic Error Throwing with `DIE()`

The `DIE()` function throws an error and has a return type of `never`, making it perfect for nullish coalescing and logical OR operations.

```ts
import DIE from "phpdie";

// With nullish coalescing
const token = process.env.TOKEN ?? DIE("Missing Token");
console.log(token); // typeof token === "string"

// With logical OR (PHP-style)
const config = loadConfig() || DIE("Failed to load config");

// Throw custom Error objects
const data = (await fetchData()) ?? DIE(new Error("API request failed"));
```

### Alert & Die with `DIES()`

The `DIES()` function calls an alert/logging function before throwing an error. Perfect for user notifications or logging before termination.

```ts
import { DIES } from "phpdie";

const ooops = false;

// With browser alert
ooops || DIES(alert, "Something went wrong!");

// With console.error
ooops || DIES(console.error, "Error:", 404, "Not Found");

// With toast notifications (React, Vue, etc.)
ooops || DIES(toast.error, "Failed to save data");

// With custom error handler
const showError = (msg: string) => {
  /* show error in UI */
};
ooops || DIES(showError, "Custom error message");

// With a lambda function
ooops || DIES(() => "anyway die");
```

**How it works:**

- Calls the provided alert function with the given arguments
- Throws an Error with message "DIES" and arguments stored in the `cause` property
- Never returns (return type is `never`)

## API

### `DIE(reason?: string | Error): never`

Throws an error and never returns.

**Parameters:**

- `reason` - Error message string or Error object (optional)

**Throws:**

- If `reason` is a string: throws the error stack trace
- If `reason` is an Error: throws the Error object
- If no `reason`: throws undefined

### `DIES(alertFn: Function, ...args: any[]): never`

Calls an alert function then throws an error.

**Parameters:**

- `alertFn` - Function to call before throwing (e.g., `alert`, `console.error`, `toast.error`)
- `...args` - Arguments to pass to the alert function

**Throws:**

- An Error with message "DIES" and `cause` containing the alert arguments

## Examples from Tests

```ts
import DIE from "phpdie";

// Test: continues when value exists
const token = "123" ?? DIE("Missing Token");
console.log(token); // "123"
expect(token).toEqual("123");

// Test: throws when value is missing
try {
  const token = undefined ?? DIE("Missing Token");
} catch (err) {
  expect(err).toEqual("Missing Token");
}

// Test: throws Error objects
try {
  const token = undefined ?? DIE(new Error("Missing Token"));
} catch (err) {
  expect(err.message).toEqual("Missing Token");
}
```

## Implementation

```ts
export function DIE(reason?: string | Error): never {
  if (typeof reason === "string") {
    const err = new Error(reason);
    throw err.stack;
  }
  throw reason;
}

export function DIES(alertFn: Function, ...args: any[]): never {
  alertFn(...args);
  throw new Error("DIES", { cause: args });
}
```

## License

MIT © [snomiao](https://github.com/snomiao)

## Links

- [npm package (phpdie)](https://www.npmjs.com/package/phpdie)
- [npm package (@snomiao/die)](https://www.npmjs.com/package/@snomiao/die)
- [GitHub Repository](https://github.com/snomiao/phpdie)
