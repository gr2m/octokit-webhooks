import { createServer } from "http";
import { readFileSync } from "fs";

import fetch from "node-fetch";
import { sign } from "@octokit/webhooks-methods";

// import without types
const express = require("express");

import { Webhooks, createNodeMiddleware } from "../../src/index.js";

const pushEventPayload = readFileSync(
  "test/fixtures/push-payload.json",
  "utf-8"
);
let signatureSha256: string;

describe("createNodeMiddleware(webhooks)", () => {
  beforeAll(async () => {
    signatureSha256 = await sign(
      { secret: "mySecret", algorithm: "sha256" },
      pushEventPayload
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("README example", async () => {
    expect.assertions(3);

    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    webhooks.on("push", (event) => {
      expect(event.id).toBe("123e4567-e89b-12d3-a456-426655440000");
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: pushEventPayload,
      }
    );

    expect(response.status).toEqual(200);
    await expect(response.text()).resolves.toBe("ok\n");

    server.close();
  });

  test("request.body already parsed (e.g. Lambda)", async () => {
    expect.assertions(3);

    const webhooks = new Webhooks({
      secret: "mySecret",
    });
    const dataChunks: any[] = [];
    const middleware = createNodeMiddleware(webhooks);

    const server = createServer((req, res) => {
      req.once("data", (chunk) => dataChunks.push(chunk));
      req.once("end", () => {
        // @ts-expect-error - TS2339: Property 'body' does not exist on type 'IncomingMessage'.
        req.body = JSON.parse(Buffer.concat(dataChunks).toString());
        middleware(req, res);
      });
    }).listen();

    webhooks.on("push", (event) => {
      expect(event.id).toBe("123e4567-e89b-12d3-a456-426655440000");
    });

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: pushEventPayload,
      }
    );

    expect(response.status).toEqual(200);
    expect(await response.text()).toEqual("ok\n");

    server.close();
  });

  test("Handles invalid JSON", async () => {
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: "invalid",
      }
    );

    expect(response.status).toEqual(400);

    await expect(response.text()).resolves.toMatch(/SyntaxError: Invalid JSON/);

    server.close();
  });

  test("Handles non POST request", async () => {
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "PUT",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: "invalid",
      }
    );

    expect(response.status).toEqual(404);

    await expect(response.text()).resolves.toMatch(
      /Unknown route: PUT \/api\/github\/webhooks/
    );

    server.close();
  });

  test("custom non-found handler", async () => {
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    const server = createServer(
      createNodeMiddleware(webhooks, {
        onUnhandledRequest(_request, response) {
          response.writeHead(404);
          response.end("nope");
        },
      })
    ).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "PUT",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: "invalid",
      }
    );

    expect(response.status).toEqual(404);

    await expect(response.text()).resolves.toEqual("nope");

    server.close();
  });

  test("Handles missing headers", async () => {
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          // "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: "invalid",
      }
    );

    expect(response.status).toEqual(400);

    await expect(response.text()).resolves.toMatch(
      /Required headers missing: x-github-event/
    );

    server.close();
  });

  test("Handles non-request errors", async () => {
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    webhooks.on("push", () => {
      throw new Error("boom");
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: pushEventPayload,
      }
    );

    await expect(response.text()).resolves.toMatch(/boom/);
    expect(response.status).toEqual(500);

    server.close();
  });

  test("Handles timeout", async () => {
    jest.useFakeTimers();

    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    webhooks.on("push", async () => {
      jest.advanceTimersByTime(10000);
      server.close();
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: pushEventPayload,
      }
    );

    await expect(response.text()).resolves.toMatch(/still processing/);
    expect(response.status).toEqual(202);
  });

  test("Handles timeout with error", async () => {
    jest.useFakeTimers();

    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    webhooks.on("push", async () => {
      jest.advanceTimersByTime(10000);
      server.close();
      throw new Error("oops");
    });

    const server = createServer(createNodeMiddleware(webhooks)).listen();

    // @ts-expect-error complains about { port } although it's included in returned AddressInfo interface
    const { port } = server.address();

    const response = await fetch(
      `http://localhost:${port}/api/github/webhooks`,
      {
        method: "POST",
        headers: {
          "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
          "X-GitHub-Event": "push",
          "X-Hub-Signature-256": signatureSha256,
        },
        body: pushEventPayload,
      }
    );

    await expect(response.text()).resolves.toMatch(/still processing/);
    expect(response.status).toEqual(202);
  });

  test("express middleware no mount path 404", async () => {
    const app = express();
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    app.use(createNodeMiddleware(webhooks));
    app.all("*", (_request: any, response: any) =>
      response.status(404).send("Dafuq")
    );

    const server = app.listen();

    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}/test`, {
      method: "POST",
      body: pushEventPayload,
    });

    await expect(response.text()).resolves.toBe("Dafuq");
    expect(response.status).toEqual(404);

    server.close();
  });

  test("express middleware no mount path no next", async () => {
    const app = express();
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    app.all("/foo", (_request: any, response: any) => response.end("ok\n"));
    app.use(createNodeMiddleware(webhooks));

    const server = app.listen();

    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}/test`, {
      method: "POST",
      body: pushEventPayload,
    });

    await expect(response.text()).resolves.toContain("Cannot POST /test");
    expect(response.status).toEqual(404);

    const responseForFoo = await fetch(`http://localhost:${port}/foo`, {
      method: "POST",
      body: pushEventPayload,
    });

    await expect(responseForFoo.text()).resolves.toContain("ok\n");
    expect(responseForFoo.status).toEqual(200);

    server.close();
  });

  test("express middleware no mount path with options.path", async () => {
    const app = express();
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    app.use(createNodeMiddleware(webhooks, { path: "/test" }));
    app.all("*", (_request: any, response: any) =>
      response.status(404).send("Dafuq")
    );

    const server = app.listen();

    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}/test`, {
      method: "POST",
      headers: {
        "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
        "X-GitHub-Event": "push",
        "X-Hub-Signature-256": signatureSha256,
      },
      body: pushEventPayload,
    });

    await expect(response.text()).resolves.toBe("ok\n");
    expect(response.status).toEqual(200);

    server.close();
  });

  test("express middleware with mount path with options.path", async () => {
    const app = express();
    const webhooks = new Webhooks({
      secret: "mySecret",
    });

    app.post("/test", createNodeMiddleware(webhooks, { path: "/test" }));
    app.all("*", (_request: any, response: any) =>
      response.status(404).send("Dafuq")
    );

    const server = app.listen();

    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}/test`, {
      method: "POST",
      headers: {
        "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
        "X-GitHub-Event": "push",
        "X-Hub-Signature-256": signatureSha256,
      },
      body: pushEventPayload,
    });

    await expect(response.text()).resolves.toBe("ok\n");
    expect(response.status).toEqual(200);

    server.close();
  });
});
