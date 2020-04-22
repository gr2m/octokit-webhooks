const { deprecate } = require("util");

module.exports = deprecate(
  sign,
  "src/sign/index.js is deprecated. Use lib/index.js instead."
);

const crypto = require("crypto");

export function sign(secret, payload) {
  if (!secret || !payload) {
    throw new TypeError("secret & payload required");
  }

  payload =
    typeof payload === "string" ? payload : toNormalizedJsonString(payload);
  return (
    "sha1=" + crypto.createHmac("sha1", secret).update(payload).digest("hex")
  );
}

function toNormalizedJsonString(payload) {
  return JSON.stringify(payload).replace(/[^\\]\\u[\da-f]{4}/g, (s) => {
    return s.substr(0, 3) + s.substr(3).toUpperCase();
  });
}
