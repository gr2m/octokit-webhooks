import { receiverOn } from "../../src/event-handler/on.js";
import { State } from "../../src/types";

function noop() {}

const state: State = {
  hooks: {},
  log: console,
};

beforeEach(() => jest.resetAllMocks());

// Test broken with TypeScript without the ignore
test("receiver.on with invalid event name", () => {
  const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(noop);

  // @ts-expect-error
  receiverOn(state, "foo", noop);

  expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  expect(consoleWarnSpy).toHaveBeenLastCalledWith(
    '"foo" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)'
  );
});

test("receiver.on with event name of '*' throws an error", () => {
  // @ts-expect-error
  expect(() => receiverOn(state, "*", noop)).toThrow(
    'Using the "*" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.onAny() method instead'
  );
});

test("receiver.on with event name of 'error' throws an error", () => {
  // @ts-expect-error
  expect(() => receiverOn(state, "error", noop)).toThrow(
    'Using the "error" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.onError() method instead'
  );
});
