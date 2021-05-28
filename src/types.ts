import { RequestError } from "@octokit/request-error";
import AggregateError from "aggregate-error";
import type {
  WebhookEventMap,
  WebhookEventName,
} from "@octokit/webhooks-types";
import { Logger } from "./createLogger";
import type { emitterEventNames } from "./generated/webhook-names";

export type EmitterWebhookEventName = typeof emitterEventNames[number];
export type EmitterWebhookEvent<
  TEmitterEvent extends EmitterWebhookEventName = EmitterWebhookEventName
> = TEmitterEvent extends `${infer TWebhookEvent}.${infer TAction}`
  ? BaseWebhookEvent<Extract<TWebhookEvent, WebhookEventName>> & {
      payload: { action: TAction };
    }
  : BaseWebhookEvent<Extract<TEmitterEvent, WebhookEventName>>;

interface BaseWebhookEvent<TName extends WebhookEventName> {
  id: string;
  name: TName;
  payload: WebhookEventMap[TName];
}

export interface Options<TTransformed = unknown> {
  secret?: string;
  transform?: TransformMethod<TTransformed>;
  log?: Partial<Logger>;
}

type TransformMethod<T> = (event: EmitterWebhookEvent) => T | PromiseLike<T>;

export type HandlerFunction<
  TName extends EmitterWebhookEventName,
  TTransformed
> = (event: EmitterWebhookEvent<TName> & TTransformed) => any;

type Hooks = {
  [key: string]: Function[];
};

export interface State extends Options<any> {
  eventHandler?: any;
  hooks: Hooks;
  log: Logger;
}

/**
 * Error object with optional properties coming from `octokit.request` errors
 */
export type WebhookError = Error & Partial<RequestError>;

// todo: rename to "EmitterErrorEvent"
export interface WebhookEventHandlerError extends AggregateError<WebhookError> {
  event: EmitterWebhookEvent;
}
