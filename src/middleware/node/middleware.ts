// remove type imports from http for Deno compatibility
// see https://github.com/octokit/octokit.js/issues/24#issuecomment-817361886
// import { IncomingMessage, ServerResponse } from "http";
type IncomingMessage = any;
type ServerResponse = any;

import { WebhookEventName } from "@octokit/webhooks-types";

import { Webhooks } from "../../index";
import { WebhookEventHandlerError } from "../../types";
import { MiddlewareOptions } from "./types";
import { getMissingHeaders } from "./get-missing-headers";
import { getPayload } from "./get-payload";

export async function middleware(
  webhooks: Webhooks,
  options: Required<MiddlewareOptions>,
  request: IncomingMessage,
  response: ServerResponse,
  next?: Function
) {
  const { pathname } = new URL(request.url as string, "http://localhost");

  const isUnknownRoute = request.method !== "POST" || pathname !== options.path;
  const isExpressMiddleware = typeof next === "function";
  if (isUnknownRoute) {
    if (isExpressMiddleware) {
      return next!();
    } else {
      return options.onUnhandledRequest(request, response);
    }
  }

  const missingHeaders = getMissingHeaders(request).join(", ");

  if (missingHeaders) {
    response.writeHead(400, {
      "content-type": "application/json",
    });
    response.end(
      JSON.stringify({
        error: `Required headers missing: ${missingHeaders}`,
      })
    );

    return;
  }

  const eventName = request.headers["x-github-event"] as WebhookEventName;
  const signatureSHA256 = request.headers["x-hub-signature-256"] as string;
  const id = request.headers["x-github-delivery"] as string;

  options.log.debug(`${eventName} event received (id: ${id})`);

  // GitHub will abort the request if it does not receive a response within 10s
  // See https://github.com/octokit/webhooks.js/issues/185
  let didTimeout = false;
  const timeout = setTimeout(() => {
    didTimeout = true;
    response.statusCode = 202;
    response.end("still processing\n");
  }, 9000).unref();

  try {
    const payload = await getPayload(request);

    await webhooks.verifyAndReceive({
      id: id,
      name: eventName as any,
      payload: payload as any,
      signature: signatureSHA256,
    });
    clearTimeout(timeout);

    if (didTimeout) return;

    response.end("ok\n");
  } catch (error) {
    clearTimeout(timeout);

    if (didTimeout) return;

    const statusCode = Array.from((error as WebhookEventHandlerError).errors)[0]
      .status;
    response.statusCode = typeof statusCode !== "undefined" ? statusCode : 500;
    response.end(error.toString());
  }
}
