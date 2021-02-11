import type {
  EmitterEvent,
  EmitterEventName,
  HandlerFunction,
  Options,
  State,
  WebhookEventHandlerError,
} from "../types";
import {
  receiverOn as on,
  receiverOnAny as onAny,
  receiverOnError as onError,
} from "./on";
import { receiverHandle as receive } from "./receive";
import { removeListener } from "./remove-listener";

interface EventHandler<TTransformed = unknown> {
  on<E extends EmitterEventName>(
    event: E | E[],
    callback: HandlerFunction<E, TTransformed>
  ): void;
  onAny(handler: (event: EmitterEvent) => any): void;
  onError(handler: (event: WebhookEventHandlerError) => any): void;
  removeListener<E extends EmitterEventName>(
    event: E | E[],
    callback: HandlerFunction<E, TTransformed>
  ): void;
  receive(event: EmitterEvent): Promise<void>;
}

export function createEventHandler(options: Options<any>): EventHandler {
  const state: State = {
    hooks: {},
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
