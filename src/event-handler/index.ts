import { createLogger } from "../createLogger.js";
import type {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
  HandlerFunction,
  Options,
  State,
  WebhookEventHandlerError,
} from "../types";
import {
  receiverOn as on,
  receiverOnAny as onAny,
  receiverOnError as onError,
} from "./on.js";
import { receiverHandle as receive } from "./receive.js";
import { removeListener } from "./remove-listener.js";

interface EventHandler<TTransformed> {
  on<E extends EmitterWebhookEventName>(
    event: E | E[],
    callback: HandlerFunction<E, TTransformed>
  ): void;
  onAny(handler: (event: EmitterWebhookEvent) => any): void;
  onError(handler: (event: WebhookEventHandlerError) => any): void;
  removeListener<E extends EmitterWebhookEventName>(
    event: E | E[],
    callback: HandlerFunction<E, TTransformed>
  ): void;
  receive(event: EmitterWebhookEvent): Promise<void>;
}

export function createEventHandler<TTransformed>(
  options: Options<TTransformed>
): EventHandler<TTransformed> {
  const state: State = {
    hooks: {},
    log: createLogger(options && options.log),
  };

  if (options && options.transform) {
    state.transform = options.transform;
  }

  return {
    on: on.bind(null, state),
    onAny: onAny.bind(null, state),
    onError: onError.bind(null, state),
    removeListener: removeListener.bind(null, state),
    receive: receive.bind(null, state),
  };
}
