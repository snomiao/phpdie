# DIE Function Test Matrix

Comprehensive test coverage for all DIE function usage patterns.

## Test Coverage Summary

- **Total Tests:** 46
- **Test Patterns:** 6 major patterns + edge cases + integration tests
- **All Tests:** ✅ PASSING

## Test Patterns

### Pattern 1: DIE(string) - Plain String Errors (wrapped in Error)
Tests: 6/6 ✅

- ✅ throws Error with simple message
- ✅ throws Error with whitespace trimmed
- ✅ works with nullish coalescing (??)
- ✅ works with logical OR (||)
- ✅ does not throw when value exists (??)
- ✅ does not throw when value is truthy (||)

**Note:** All strings are automatically wrapped in `new Error()` for better stack traces and error handling.

```typescript
const value = undefined ?? DIE("Missing value");
// Throws: Error("Missing value")

const config = loadConfig() || DIE("Failed to load config");
// Throws: Error("Failed to load config")
```

### Pattern 2: DIE(Error) - Error Objects
Tests: 4/4 ✅

- ✅ throws Error object
- ✅ throws Error with cause (ES2022)
- ✅ works with nullish coalescing
- ✅ throws custom Error subclasses

```typescript
DIE(new Error("Error message"));
DIE(new Error("Main error", { cause: { code: "INVALID_INPUT" } }));
const token = process.env.TOKEN ?? DIE(new Error("Missing Token"));
```

### Pattern 3: DIE\`template\` - Tagged Templates (no interpolation)
Tests: 3/3 ✅

- ✅ throws Error with simple template string
- ✅ works with nullish coalescing
- ✅ works with logical OR

**Note:** Tagged template strings are also wrapped in `new Error()`.

```typescript
DIE`Simple template error`;
// Throws: Error("Simple template error")

const token = process.env.TOKEN ?? DIE`Missing Token`;
// Throws: Error("Missing Token")
```

### Pattern 4: DIE\`template ${value}\` - Tagged Templates (with interpolation)
Tests: 6/6 ✅

- ✅ throws Error with single interpolated value
- ✅ throws Error with multiple interpolated values
- ✅ throws Error with string interpolation
- ✅ throws Error with Error object interpolation
- ✅ throws Error with number and boolean interpolation
- ✅ throws Error with object interpolation

**Note:** All interpolated values are converted to strings and wrapped in `new Error()`.

```typescript
DIE`User ${userId} not found`;
// Throws: Error("User 123 not found")

DIE`User ${userId} cannot ${action} this resource`;
// Throws: Error("User 123 cannot delete this resource")

DIE`Expected ${expected} but got ${actual}`;
// Throws: Error("Expected value1 but got value2")

DIE`Failed to process: ${innerError}`;
// Throws: Error("Failed to process: Inner error")
```

### Pattern 5: DIE(fn, ...args) - Function Call Pattern
Tests: 8/8 ✅

- ✅ calls function with single argument
- ✅ calls function with multiple arguments
- ✅ works with console.error
- ✅ works with alert-like functions
- ✅ works with toast-like functions
- ✅ works with custom error handlers
- ✅ catches errors from the alert function itself
- ✅ works with arrow functions

```typescript
DIE(alert, "Error message");
DIE(toast.error, "Upload failed");
DIE(console.error, "Network error:", 500);
DIE(customHandler, "Custom error", { code: 500 });
false || DIE(mockAlert, "Alert message");
```

### Pattern 6: Edge Cases
Tests: 5/5 ✅

- ✅ throws undefined when called with no arguments
- ✅ throws null when called with null
- ✅ throws empty string when called with empty string
- ✅ throws number when called with number
- ✅ does NOT treat single function argument as function pattern

```typescript
DIE(); // throws undefined
DIE(null); // throws null
DIE(""); // throws empty string
DIE(404); // throws number 404
DIE(fn); // throws function (doesn't call it)
```

### Legacy Pattern: DIES (deprecated)
Tests: 3/3 ✅

- ✅ calls alert function and throws error
- ✅ works with multiple arguments
- ✅ works with no additional arguments

```typescript
// Old pattern (deprecated, but still works)
DIES(mockAlert, "Error message");
DIES(toast.error, "Upload failed");

// New pattern (recommended)
DIE(mockAlert, "Error message");
DIE(toast.error, "Upload failed");
```

### Integration Tests: Real-world Usage Patterns
Tests: 5/5 ✅

- ✅ environment variable validation
- ✅ function parameter validation
- ✅ array element access
- ✅ API response validation
- ✅ form validation with toast notifications

```typescript
// Environment variable validation
const apiKey = process.env.API_KEY ?? DIE("API key is required");

// Function parameter validation
function processUser(userId: string | null) {
  userId || DIE("User ID is required");
  return `Processing user ${userId}`;
}

// Form validation with toast
function validateForm(email: string, password: string) {
  email.trim() || DIE(toast.error, "Email is required");
  password.trim() || DIE(toast.error, "Password is required");
  password.length >= 8 || DIE(toast.error, "Password must be at least 8 characters");
  return { email, password };
}
```

### Type Safety Tests: Compile-time Verification
Tests: 2/2 ✅

- ✅ return type is never
- ✅ works in type narrowing

```typescript
function test(): string {
  const value = process.env.VALUE;
  if (!value) {
    DIE("Value required");
    // TypeScript knows this is unreachable
  }
  return value; // TypeScript knows value is string here
}

function processValue(value: string | null): string {
  value ?? DIE("Value cannot be null");
  // TypeScript narrows value to string here
  return value.toUpperCase();
}
```

## Important: All Strings Wrapped in Error Objects

**All string errors are automatically wrapped in `new Error()`** for better error handling:

- ✅ Better stack traces
- ✅ Consistent error type (always Error objects)
- ✅ Works with error tracking services (Sentry, etc.)
- ✅ Standard JavaScript error handling conventions

```typescript
// Before (old behavior - plain strings)
try {
  DIE("error message");
} catch (err) {
  console.log(err); // "error message" (plain string)
}

// After (new behavior - Error objects)
try {
  DIE("error message");
} catch (err) {
  console.log(err); // Error: error message (Error object)
  console.log(err.message); // "error message"
  console.log(err.stack); // Full stack trace
}
```

## Test Matrix Coverage

| Pattern | Description | Tests | Status |
|---------|-------------|-------|--------|
| Pattern 1 | Plain string errors (wrapped in Error) | 6 | ✅ |
| Pattern 2 | Error objects | 4 | ✅ |
| Pattern 3 | Tagged templates (no interpolation, wrapped in Error) | 3 | ✅ |
| Pattern 4 | Tagged templates (with interpolation, wrapped in Error) | 6 | ✅ |
| Pattern 5 | Function call pattern DIE(fn, ...args) | 8 | ✅ |
| Pattern 6 | Edge cases | 5 | ✅ |
| Legacy | DIES function (deprecated) | 3 | ✅ |
| Integration | Real-world usage | 5 | ✅ |
| Type Safety | TypeScript compile-time checks | 2 | ✅ |
| **TOTAL** | | **42** | **✅** |

## Runtime Detection Logic

The DIE function uses runtime `typeof` checks to detect the call pattern:

1. **Tagged template**: `typeof first === 'object' && first && Array.isArray(first) && 'raw' in first`
2. **Error object**: `first instanceof Error`
3. **Function pattern**: `typeof first === 'function' && rest.length > 0`
4. **Plain string**: `typeof first === 'string'`
5. **Fallback**: throw the value as-is

## TypeScript Overloads

```typescript
export function DIE(message: string): never;
export function DIE(error: Error): never;
export function DIE<Fn extends (...args: any[]) => any>(
  alertFn: Fn,
  ...args: Parameters<Fn>
): never;
export function DIE(tsa: TemplateStringsArray, ...slots: any[]): never;
```

## Migration Guide

### From DIES to DIE

```typescript
// Old pattern (deprecated)
false || DIES(toast.error, "Upload failed");
false || DIES(console.error, "Error:", 500);

// New pattern (recommended)
false || DIE(toast.error, "Upload failed");
false || DIE(console.error, "Error:", 500);
```

Both patterns work identically:
1. Call the alert/toast function with the provided arguments
2. Throw an Error with message "DIE"/"DIES" and arguments in the `cause` property

The new DIE pattern is recommended as it consolidates all error throwing into a single function.

## Running Tests

```bash
# Run all tests
bun test

# Run tests with verbose output
bun test --verbose

# Run specific test file
bun test index.spec.ts
```

## Test Results

```
bun test v1.3.6

 46 pass
 0 fail
 87 expect() calls
Ran 46 tests across 2 files. [52.00ms]
```

✅ All tests passing!
