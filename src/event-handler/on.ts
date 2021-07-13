import { emitterEventNames } from "../generated/webhook-names.js";
import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
  State,
  WebhookEventHandlerError,
} from "../types";

function handleEventHandlers(
  state: State,
  webhookName: EmitterWebhookEventName | "error" | "*",
  handler: Function
) {
  if (!state.hooks[webhookName]) {
    state.hooks[webhookName] = [];
  }

  state.hooks[webhookName].push(handler);
}
export function receiverOn(
  state: State,
  webhookNameOrNames: EmitterWebhookEventName | EmitterWebhookEventName[],
  handler: Function
) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach((webhookName) =>
      receiverOn(state, webhookName, handler)
    );
    return;
  }

  if (["*", "error"].includes(webhookNameOrNames)) {
    const webhookName =
      (webhookNameOrNames as string) === "*" ? "any" : webhookNameOrNames;

    const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${
      webhookName.charAt(0).toUpperCase() + webhookName.slice(1)
    }() method instead`;

    throw new Error(message);
  }

  if (!emitterEventNames.includes(webhookNameOrNames)) {
    state.log.warn(
      `"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`
    );
  }

  handleEventHandlers(state, webhookNameOrNames, handler);
}

export function receiverOnAny(
  state: State,
  handler: (event: EmitterWebhookEvent) => any
) {
  handleEventHandlers(state, "*", handler);
}

export function receiverOnError(
  state: State,
  handler: (event: WebhookEventHandlerError) => any
) {
  handleEventHandlers(state, "error", handler);
}
