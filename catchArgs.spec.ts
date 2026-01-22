import { catchArgs } from "./catchArgs";

const parse = (args: string) => JSON.parse(args);
const asyncParse = async (args: string) => JSON.parse(args);

it("works sync", async () => {
  expect(catchArgs(parse)("[1,2,3]")).toEqual([1, 2, 3]);
});
it("works async", async () => {
  expect(await catchArgs(asyncParse)("[1,2,3]")).toEqual([1, 2, 3]);
});
it("dies sync", async () => {
  const rej = expect(
    (async function () {
      return catchArgs(parse)("not_parsable");
    })(),
  ).rejects;
  await rej.toBeInstanceOf(Error);
  await rej.toHaveProperty("cause", { args: ["not_parsable"] });
});
it("dies async", async () => {
  const rej = expect(
    (async function () {
      return await catchArgs(asyncParse)("not_parsable");
    })(),
  ).rejects;
  await rej.toBeInstanceOf(Error);
  await rej.toHaveProperty("cause", { args: ["not_parsable"] });
});
