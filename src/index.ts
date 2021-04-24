import { sign, verify } from "@octokit/webhooks-methods";

import { createLogger } from "./createLogger";
import { createEventHandler } from "./event-handler/index";
import { verifyAndReceive } from "./verify-and-receive";
import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
  HandlerFunction,
  Options,
  State,
  WebhookError,
  WebhookEventHandlerError,
} from "./types";

export { createNodeMiddleware } from "./middleware/node/index";

// U holds the return value of `transform` function in Options
class Webhooks<TTransformed = unknown> {
  public sign: (payload: string | object) => Promise<string>;
  public verify: (
    eventPayload: string | object,
    signature: string
  ) => Promise<boolean>;
  public on: <E extends EmitterWebhookEventName>(
    event: E | E[],
    callback: HandlerFunction<E, TTransformed>
  ) => void;
  public onAny: (callback: (event: EmitterWebhookEvent) => any) => void;
  public onError: (callback: (event: WebhookEventHandlerError) => any) => void;
  public removeListener: <E extends EmitterWebhookEventName>(
    event: E | E[],
    callback: HandlerFunction<E, TTransformed>
  ) => void;
  public receive: (event: EmitterWebhookEvent) => Promise<void>;
  public verifyAndReceive: (
    options: EmitterWebhookEvent & { signature: string }
  ) => Promise<void>;

  constructor(options: Options<TTransformed> & { secret: string }) {
    if (!options?.secret) {
      throw new Error("[@octokit/webhooks] options.secret required");
    }

    const state: State & { secret: string } = {
      eventHandler: createEventHandler(options),
      secret: options.secret,
      hooks: {},
      log: createLogger(options.log),
    };

    this.sign = sign.bind(null, options.secret);
    this.verify = verify.bind(null, options.secret);
    this.on = state.eventHandler.on;
    this.onAny = state.eventHandler.onAny;
    this.onError = state.eventHandler.onError;
    this.removeListener = state.eventHandler.removeListener;
    this.receive = state.eventHandler.receive;
    this.verifyAndReceive = verifyAndReceive.bind(null, state);
  }
}

export { createEventHandler, Webhooks, EmitterWebhookEvent, WebhookError };
