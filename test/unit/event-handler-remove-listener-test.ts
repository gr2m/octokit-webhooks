import { removeListener } from "../../src/event-handler/remove-listener.js";
import { State } from "../../src/types";

test("remove-listener: single listener", () => {
  const push = () => {};

  const state: State = {
    hooks: {
      push: [push],
    },
    log: console,
  };

  expect(() => removeListener(state, "push", push)).not.toThrow();
  expect(state).toStrictEqual({ hooks: { push: [] }, log: console });
});

test("remove-listener: multiple listeners", () => {
  const push1 = () => {};
  const push2 = () => {};
  const push3 = () => {};

  const ping = () => {};

  const state: State = {
    hooks: {
      push: [push1, push2, push3],
      ping: [ping],
    },
    log: console,
  };

  expect(() => {
    removeListener(state, "push", push1);
    removeListener(state, "push", push2);
    removeListener(state, "push", push3);
  }).not.toThrow();
  expect(state).toStrictEqual({
    hooks: { push: [], ping: [ping] },
    log: console,
  });
});
