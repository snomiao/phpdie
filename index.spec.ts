import { DIE, DIES } from ".";

it("lives", () => {
  const token = "123";
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

it("dies with template string", () => {
  let err: any;
  try {
    const token = process.env.TOKEN ?? DIE`Missing Token`;
    console.log(token);
  } catch (e) {
    err = e;
  }
  expect(err).toEqual("Missing Token");
});

it("dies with template string and interpolated values", () => {
  let err: any;
  const userId = 123;
  const action = "access";
  try {
    DIE`User ${userId} cannot ${action} this resource`;
  } catch (e) {
    err = e;
  }
  expect(err).toEqual("User 123 cannot access this resource");
});

it("dies with template string and multiple interpolations", () => {
  let err: any;
  try {
    const expected = "value1";
    const actual = "value2";
    DIE`Expected ${expected} but got ${actual}`;
  } catch (e) {
    err = e;
  }
  expect(err).toEqual("Expected value1 but got value2");
});

it("dies with template string and Error object interpolation", () => {
  let err: any;
  const innerError = new Error("Inner error");
  try {
    DIE`Failed to process: ${innerError}`;
  } catch (e) {
    err = e;
  }
  expect(err).toContain("Failed to process:");
  expect(err).toContain("Inner error");
});

describe("DIE with alert/toast function pattern", () => {
  it("calls alert function and throws error", () => {
    const calls: any[][] = [];
    const mockAlert = (...args: any[]) => calls.push(args);
    let err: any;

    try {
      DIE(mockAlert, "Error message");
    } catch (e) {
      err = e;
    }

    expect(calls).toEqual([["Error message"]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIE");
    expect(err.cause).toEqual(["Error message"]);
  });

  it("calls alert with multiple arguments", () => {
    const calls: any[][] = [];
    const mockAlert = (...args: any[]) => calls.push(args);
    let err: any;

    try {
      DIE(mockAlert, "Error:", 404, "Not Found");
    } catch (e) {
      err = e;
    }

    expect(calls).toEqual([["Error:", 404, "Not Found"]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIE");
    expect(err.cause).toEqual(["Error:", 404, "Not Found"]);
  });

  it("works with console.error", () => {
    const originalConsoleError = console.error;
    const calls: any[][] = [];
    console.error = (...args: any[]) => calls.push(args);
    let err: any;

    try {
      DIE(console.error, "Something went wrong");
    } catch (e) {
      err = e;
    }

    expect(calls).toEqual([["Something went wrong"]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIE");
    expect(err.cause).toEqual(["Something went wrong"]);

    console.error = originalConsoleError;
  });

  it("works with custom toast-like function", () => {
    const calls: any[][] = [];
    const mockToastError = (...args: any[]) => calls.push(args);
    let err: any;

    try {
      DIE(mockToastError, "Toast message", { severity: "error" });
    } catch (e) {
      err = e;
    }

    expect(calls).toEqual([["Toast message", { severity: "error" }]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIE");
    expect(err.cause).toEqual(["Toast message", { severity: "error" }]);
  });
});

describe("DIES", () => {
  it("calls alert function and throws error", () => {
    const calls: any[][] = [];
    const mockAlert = (...args: any[]) => calls.push(args);
    let err: any;
    
    try {
      DIES(mockAlert, "Error message");
    } catch (e) {
      err = e;
    }
    
    expect(calls).toEqual([["Error message"]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIES");
    expect(err.cause).toEqual(["Error message"]);
  });

  it("calls alert with multiple arguments", () => {
    const calls: any[][] = [];
    const mockAlert = (...args: any[]) => calls.push(args);
    let err: any;
    
    try {
      DIES(mockAlert, "Error:", 404, "Not Found");
    } catch (e) {
      err = e;
    }
    
    expect(calls).toEqual([["Error:", 404, "Not Found"]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIES");
    expect(err.cause).toEqual(["Error:", 404, "Not Found"]);
  });

  it("works with console.error", () => {
    const originalConsoleError = console.error;
    const calls: any[][] = [];
    console.error = (...args: any[]) => calls.push(args);
    let err: any;
    
    try {
      DIES(console.error, "Something went wrong");
    } catch (e) {
      err = e;
    }
    
    expect(calls).toEqual([["Something went wrong"]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIES");
    expect(err.cause).toEqual(["Something went wrong"]);
    
    console.error = originalConsoleError;
  });

  it("works with custom alert-like function", () => {
    const calls: any[][] = [];
    const mockToastError = (...args: any[]) => calls.push(args);
    let err: any;
    
    try {
      DIES(mockToastError, "Toast message", { severity: "error" });
    } catch (e) {
      err = e;
    }
    
    expect(calls).toEqual([["Toast message", { severity: "error" }]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIES");
    expect(err.cause).toEqual(["Toast message", { severity: "error" }]);
  });

  it("works with no additional arguments", () => {
    const calls: any[][] = [];
    const mockAlert = (...args: any[]) => calls.push(args);
    let err: any;
    
    try {
      DIES(mockAlert);
    } catch (e) {
      err = e;
    }
    
    expect(calls).toEqual([[]]);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("DIES");
    expect(err.cause).toEqual([]);
  });
});
