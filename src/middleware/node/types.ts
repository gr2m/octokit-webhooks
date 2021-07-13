// remove type imports from http for Deno compatibility
// see https://github.com/octokit/octokit.js/issues/24#issuecomment-817361886
// import { IncomingMessage, ServerResponse } from "http";
type IncomingMessage = any;
type ServerResponse = any;

import { Logger } from "../../createLogger.js";

export type MiddlewareOptions = {
  path?: string;
  log?: Logger;
  onUnhandledRequest?: (
    request: IncomingMessage,
    response: ServerResponse
  ) => void;
};
