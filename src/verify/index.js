const { deprecate } = require("util");

module.exports = deprecate(
  verify,
  "src/verify/index.js is deprecated. Use lib/index.js instead."
);

const crypto = require("crypto");
const Buffer = require("buffer").Buffer;

const { sign } = require("../sign");

function verify(secret, eventPayload, signature) {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError("secret, eventPayload & signature required");
  }

  const signatureBuffer = Buffer.from(signature);
  const verificationBuffer = Buffer.from(sign(secret, eventPayload));

  if (signatureBuffer.length !== verificationBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, verificationBuffer);
}

/* istanbul ignore next */
function timingSafeEqual(signatureBuffer, verificationBuffer) {
  return crypto.timingSafeEqual(signatureBuffer, verificationBuffer);
}

module.exports.verify = verify;
