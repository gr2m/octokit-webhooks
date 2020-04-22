const { deprecate } = require("util");

module.exports = deprecate(
  createWebhooksApi,
  "src/index.js is deprecated. Use lib/index.js instead."
);

const { createEventHandler } = require("./event-handler");
const middleware = require("./middleware/middleware");
const { sign } = require("./sign");
const verify = require("./verify");
const verifyAndReceive = require("./middleware/verify-and-receive");

export function createWebhooksApi(options) {
  if (!options || !options.secret) {
    throw new Error("options.secret required");
  }

  const state = {
    eventHandler: createEventHandler(options),
    path: options.path || "/",
    secret: options.secret,
  };

  return {
    sign: sign.bind(null, options.secret),
    verify: verify.bind(null, options.secret),
    on: state.eventHandler.on,
    removeListener: state.eventHandler.removeListener,
    receive: state.eventHandler.receive,
    middleware: middleware.bind(null, state),
    verifyAndReceive: verifyAndReceive.bind(null, state),
  };
}
