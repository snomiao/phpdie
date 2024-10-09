import { DIE } from ".";

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
