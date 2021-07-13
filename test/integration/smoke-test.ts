import { Webhooks, createEventHandler } from "../../src/index.js";

test("@octokit/webhooks", () => {
  const emitWarningSpy = jest.spyOn(process, "emitWarning");
  const api = new Webhooks({
    secret: "mysecret",
  });

  expect(typeof api.sign).toBe("function");
  expect(typeof api.verify).toBe("function");
  expect(typeof api.on).toBe("function");
  expect(typeof api.removeListener).toBe("function");
  expect(typeof api.receive).toBe("function");
  expect(typeof api.verifyAndReceive).toBe("function");
  expect(emitWarningSpy).not.toHaveBeenCalled();
});

test('require("@octokit/webhooks").createEventHandler', () => {
  const emitWarningSpy = jest.spyOn(process, "emitWarning");

  expect(() => {
    createEventHandler({});
  }).not.toThrow();
  expect(emitWarningSpy).not.toHaveBeenCalled();
});
