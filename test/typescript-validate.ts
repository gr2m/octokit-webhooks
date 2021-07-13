import {
  Webhooks,
  createEventHandler,
  EmitterWebhookEvent,
  WebhookError,
  createNodeMiddleware,
} from "../src/index.js";
import { createServer } from "http";
import { HandlerFunction, EmitterWebhookEventName } from "../src/types";

// ************************************************************
// THIS CODE IS NOT EXECUTED. IT IS FOR TYPECHECKING ONLY
// ************************************************************

const fn = (webhookEvent: EmitterWebhookEvent) => {
  // @ts-expect-error TS2367:
  //  This condition will always return 'false' since the types '"check_run" | ... many more ... | "workflow_run"' and '"check_run.completed"' have no overlap.
  if (webhookEvent.name === "check_run.completed") {
    //
  }
};

declare const on: <E extends EmitterWebhookEventName>(
  name: E | E[],
  callback: HandlerFunction<E, unknown>
) => void;

on(["check_run.completed", "code_scanning_alert.fixed"], (event) => {
  if (event.payload.action === "fixed") {
    console.log("an alert was fixed!");
  }

  if (event.payload.action === "completed") {
    console.log("a run was completed!");
  }
});

on("code_scanning_alert.fixed", (event) => {
  if (event.payload.action === "fixed") {
    console.log("an alert was fixed!");
  }

  // @ts-expect-error TS2367:
  //  This condition will always return 'false' since the types '"fixed"' and '"completed"' have no overlap.
  if (event.payload.action === "completed") {
    console.log("a run was completed!");
  }

  // @ts-expect-error TS2367:
  //  This condition will always return 'false' since the types '"fixed"' and '"completed"' have no overlap.
  if (event.payload.action === "random-string") {
    console.log("a run was completed!");
  }

  fn(event);
});

export default async function () {
  // @ts-expect-error TS2554:
  //  Expected 1 arguments, but got 0.
  new Webhooks();

  // Check that all options are optional except for secret
  new Webhooks({
    secret: "blah",
  });

  // Check all supported options
  const webhooks = new Webhooks({
    secret: "blah",
    transform: (event) => {
      console.log(event.payload);
      return Object.assign(event, { foo: "bar" });
    },
  });

  createEventHandler({ secret: "blah" });

  webhooks.onAny(async ({ id, name, payload }) => {
    console.log(name, "event received", id);
    const sig = await webhooks.sign(payload);
    webhooks.verify(payload, sig);
  });

  webhooks.on("check_run.completed", () => {});

  webhooks.on(
    ["check_run.completed", "commit_comment", "label"],
    ({ name, payload }) => {
      console.log(name);
      if ("check_run" in payload) {
        console.log(payload.check_run.output.title);
      }
      if ("comment" in payload) {
        console.log(payload.comment.user.login);
      }
    }
  );

  webhooks.on(["milestone"], (event) => {
    if (event.payload.action === "closed") {
      // @ts-expect-error TS2367:
      //  This condition will always return 'false' since the types '"closed"' and '"open"' have no overlap.
      if (event.payload.milestone.state === "open") {
        //
      }
    }
  });
  webhooks.on(["check_run.completed", "check_run.created"], () => {});
  webhooks.on("check_run.created", ({ name, payload }) => {
    console.log(payload.check_run.conclusion, name);
  });

  webhooks.on("check_run.created", () => {
    return 2;
  });

  webhooks.on("check_run.created", () => {
    return Promise.resolve(10);
  });

  webhooks.removeListener("check_run.created", ({ name, payload }) => {
    console.log(payload.check_run.conclusion, name);
  });
  webhooks.removeListener(["commit_comment", "label"], ({ name, payload }) => {
    console.log(name);
    if ("label" in payload) {
      console.log(payload.label.name);
    } else {
      console.log(payload.comment.body);
    }
  });

  webhooks.on(["check_run.completed", "code_scanning_alert.fixed"], (event) => {
    if (event.name === "check_run") {
      console.log(`a run was ${event.payload.action}!`);

      if (event.payload.action === "completed") {
        console.log("it was the completed action, obviously!");
      }

      // @ts-expect-error TS2367:
      //  This condition will always return 'false' since the types '"completed"' and '"created"' have no overlap.
      if (event.payload.action === "created") {
        //
      }
    }

    // @ts-expect-error TS2367:
    //  This condition will always return 'false' since the types '"check_run" | "code_scanning_alert"' and '"repository"' have no overlap.
    if (event.name === "repository") {
      //
    }
  });

  webhooks.on("issues", (event) => {
    // ⚠️ This test is for assuring 'transform' method is preserving event.payload
    console.log(event.payload.issue);
  });

  webhooks.on("issues", (event) => {
    // foo is set by options.transform
    console.log(event.foo);
  });

  // @ts-expect-error TS2345:
  //  Argument of type '"does_not_exist"' is not assignable to parameter of type ...
  webhooks.on("does_not_exist", (what) => {
    // this works because we pass a transform that adds foo to all events
    console.log(what.foo);
  });

  webhooks.onError((error) => {
    console.log(error.event.name);
    const [firstError] = Array.from(error);
    console.log(firstError.status);
    console.log(firstError.headers);
    console.log(firstError.request);
  });

  createServer(createNodeMiddleware(webhooks)).listen(3000);
}

export function webhookErrorTest(error: WebhookError) {
  const { request } = error;
  console.log(request);
}
