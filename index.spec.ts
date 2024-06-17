import DIE from ".";

it("dies", () => {
  let err: any;
  try {
    const token = process.env.TOKEN ?? DIE("Missing Token");
    console.log(token);
  } catch (e) {
    err = e;
  }
  expect(err.message).toEqual("Missing Token");
});

it("lives", () => {
  const token = "123" ?? DIE("Missing Token");
  console.log(token);
  expect(token).toEqual("123");
});
