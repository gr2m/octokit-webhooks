import { createEventHandler } from "./event-handler/index";
import { createMiddleware } from "./middleware/index";
import { middleware } from "./middleware/middleware";
import { sign } from "./sign/index";
import { verify } from "./verify/index";
import { verifyAndReceive } from "./middleware/verify-and-receive";
import {
  Options,
  State,
  WebhookEvent,
  WebhookError,
  HandlerFunction,
} from "./types";
import { IncomingMessage, ServerResponse } from "http";
import { All } from "./generated/get-webhook-payload-type-from-event";

class Webhooks<T extends WebhookEvent = WebhookEvent, U = {}> {
  public sign: (payload: string | object) => string;
  public verify: (eventPayload?: object, signature?: string) => boolean;
  public on: <E extends All>(
    event: E | E[],
    callback: HandlerFunction<E, U>
  ) => void;
  public removeListener: <E extends All>(
    event: E | E[],
    callback: HandlerFunction<E, U>
  ) => void;
  public receive: (options: {
    id: string;
    name: string;
    payload: any;
  }) => Promise<void>;
  public middleware: (
    request: IncomingMessage,
    response: ServerResponse,
    next?: (err?: any) => void
  ) => void | Promise<void>;
  public verifyAndReceive: (
    options: WebhookEvent & { signature: string }
  ) => Promise<void>;

  constructor(options?: Options<T>) {
    if (!options || !options.secret) {
      throw new Error("options.secret required");
    }

    const state: State = {
      eventHandler: createEventHandler(options),
      path: options.path || "/",
      secret: options.secret,
      hooks: {},
    };

    this.sign = sign.bind(null, options.secret);
    this.verify = verify.bind(null, options.secret);
    this.on = state.eventHandler.on;
    this.removeListener = state.eventHandler.removeListener;
    this.receive = state.eventHandler.receive;
    this.middleware = middleware.bind(null, state);
    this.verifyAndReceive = verifyAndReceive.bind(null, state);
  }
}

const createWebhooksApi = Webhooks.prototype.constructor;

export { EventPayloads } from "./generated/event-payloads";

export {
  createEventHandler,
  createMiddleware,
  createWebhooksApi,
  Webhooks,
  WebhookEvent,
  WebhookError,
  sign,
  verify,
};
