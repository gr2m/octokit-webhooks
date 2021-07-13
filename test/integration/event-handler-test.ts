import { createEventHandler } from "../../src/event-handler/index.js";
import { EmitterWebhookEvent, WebhookEventHandlerError } from "../../src/types";
import {
  installationCreatedPayload,
  pushEventPayload,
} from "../fixtures/index.js";

test("events", async () => {
  const eventHandler = createEventHandler({});

  const hooksCalled: string[] = [];
  function hook1() {
    return Promise.resolve().then(() => {
      hooksCalled.push("hook1");
    });
  }
  function hook2() {
    hooksCalled.push("hook2");
  }
  function hook3() {
    hooksCalled.push("hook3");
  }
  function hook4() {
    hooksCalled.push("hook4");
  }
  function hook5() {
    hooksCalled.push("installation");
  }
  function hook6() {
    hooksCalled.push("installation.created");
  }
  function hook7(event: EmitterWebhookEvent) {
    hooksCalled.push(`* (${event.name})`);
  }

  eventHandler.on("push", hook1);
  eventHandler.on("push", hook2);
  eventHandler.on("push", hook3);
  eventHandler.on(["push"], hook4);
  eventHandler.on("installation", hook5);
  eventHandler.on("installation.created", hook6);
  eventHandler.onAny(hook7);

  eventHandler.removeListener("push", hook3);
  eventHandler.removeListener(["push"], hook4);
  // @ts-expect-error TS2345:
  //  Argument of type '"unknown"' is not assignable to parameter of type ...
  eventHandler.removeListener("unknown", () => {});

  await eventHandler.receive({
    id: "123",
    name: "push",
    payload: pushEventPayload,
  });

  await eventHandler.receive({
    id: "456",
    name: "installation",
    payload: installationCreatedPayload,
  });

  expect(hooksCalled).toMatchInlineSnapshot(`
    Array [
      "hook2",
      "* (push)",
      "hook1",
      "installation.created",
      "installation",
      "* (installation)",
    ]
  `);
});

describe("when a handler throws an error", () => {
  it("throws an aggregated error", async () => {
    const eventHandler = createEventHandler({});

    eventHandler.on("push", () => {
      throw new Error("oops");
    });

    try {
      await eventHandler.receive({
        id: "123",
        name: "push",
        payload: pushEventPayload,
      });
    } catch (error) {
      expect(error.message).toMatch(/oops/);

      const errors = Array.from(error);

      expect(errors.length).toBe(1);
      expect((Array.from(error) as { message: string }[])[0].message).toBe(
        "oops"
      );

      expect(error instanceof Error).toBeTruthy();
    }
  });

  it("calls any registered error handlers", async () => {
    expect.assertions(2);
    const eventHandler = createEventHandler({});

    eventHandler.on("push", () => {
      throw new Error("oops");
    });

    return new Promise<void>(async (resolve) => {
      eventHandler.onError((error: WebhookEventHandlerError) => {
        expect(error.event.payload).toBeTruthy();
        expect(error.message).toMatch(/oops/);

        resolve();
      });

      try {
        await eventHandler.receive({
          id: "123",
          name: "push",
          payload: pushEventPayload,
        });
      } catch {
        // ignore any errors
      }
    });
  });
});

test("options.transform", (done) => {
  expect.assertions(2);

  const eventHandler = createEventHandler({
    transform: (event) => {
      expect(event.id).toBe("123");
      return "funky";
    },
  });

  eventHandler.on("push", (event: EmitterWebhookEvent) => {
    expect(event).toBe("funky");

    done();
  });

  eventHandler.receive({
    id: "123",
    name: "push",
    payload: pushEventPayload,
  });
});

test("async options.transform", (done) => {
  const eventHandler = createEventHandler({
    transform: () => {
      return Promise.resolve("funky");
    },
  });

  eventHandler.on("push", (event: EmitterWebhookEvent) => {
    expect(event).toBe("funky");
    done();
  });

  eventHandler.receive({
    id: "123",
    name: "push",
    payload: pushEventPayload,
  });
});

test("multiple errors in same event handler", async () => {
  expect.assertions(2);

  const eventHandler = createEventHandler({});

  eventHandler.on("push", () => {
    throw new Error("oops");
  });

  eventHandler.on("push", () => {
    throw new Error("oops");
  });

  try {
    await eventHandler.receive({
      id: "123",
      name: "push",
      payload: pushEventPayload,
    });
  } catch (error) {
    expect(error.message).toMatch("oops");
    expect(Array.from(error).length).toBe(2);

    expect(error instanceof Error);
  }
});
