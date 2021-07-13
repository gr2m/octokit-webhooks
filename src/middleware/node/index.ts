import { createLogger } from "../../createLogger.js";
import { Webhooks } from "../../index.js";
import { middleware } from "./middleware.js";
import { onUnhandledRequestDefault } from "./on-unhandled-request-default.js";
import { MiddlewareOptions } from "./types";

export function createNodeMiddleware(
  webhooks: Webhooks,
  {
    path = "/api/github/webhooks",
    onUnhandledRequest = onUnhandledRequestDefault,
    log = createLogger(),
  }: MiddlewareOptions = {}
) {
  return middleware.bind(null, webhooks, {
    path,
    onUnhandledRequest,
    log,
  } as Required<MiddlewareOptions>);
}
