import http from "http";

import FakeTimers from "@sinonjs/fake-timers";

import axios, { AxiosError, AxiosResponse } from "axios";
import getPort from "get-port";
import { promisify } from "util";
import { Webhooks } from "../../src";
import pushEventPayload from "../fixtures/push-payload.json";

describe("server-test", () => {
  let availablePort: number;

  beforeEach(() => {
    return getPort().then((port) => {
      availablePort = port;
    });
  });

  test("initialised without options", (t) => {
    try {
      new Webhooks();
      t.fail("should throw error");
    } catch (error) {
      t();
    }
  });

  test("GET /", (t) => {
    const api = new Webhooks({
      secret: "mysecret",
    });
    const server = http.createServer(api.middleware);

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.get(`http://localhost:${availablePort}`);
      })

      .then(() => {
        t.fail("should return a 404");
      })

      .catch((error: AxiosError) => {
        expect(error.response?.status).toBe(404);
      })

      .then(() => {
        server.close(t);
      })

      .catch((e) => expect(e instanceof Error).toBeTruthy());
  });

  test("POST / with push event payload", (t) => {
    expect.assertions(2);

    const api = new Webhooks({
      secret: "mysecret",
    });
    const server = http.createServer(api.middleware);

    api.on("push", (event) => {
      expect(event.id).toBe("123e4567-e89b-12d3-a456-426655440000");
    });

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.post(
          `http://localhost:${availablePort}`,
          pushEventPayload,
          {
            headers: {
              "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
              "X-GitHub-Event": "push",
              "X-Hub-Signature":
                "sha1=f4d795e69b5d03c139cc6ea991ad3e5762d13e2f",
            },
          }
        );
      })

      .then((result: AxiosResponse) => {
        expect(result.status).toBe(200);
      })
      .catch((e) => expect(e instanceof Error).toBeTruthy())
      .then(() => {
        server.close();
      })

      .catch((e) => expect(e instanceof Error).toBeTruthy());
  });

  // TEST
  test("POST / with push event payload (request.body already parsed)", (t) => {
    expect.assertions(2);

    const api = new Webhooks({
      secret: "mysecret",
    });
    const dataChunks: any[] = [];
    let timeout: NodeJS.Timeout;
    const server = http.createServer((req, res) => {
      req.once("data", (chunk) => dataChunks.push(chunk));
      req.once("end", () => {
        // @ts-ignore
        req.body = JSON.parse(Buffer.concat(dataChunks).toString());
        api.middleware(req, res);

        timeout = setTimeout(() => {
          res.statusCode = 500;
          res.end("Middleware timeout");
        }, 3000);
      });
    });

    api.on("push", (event) => {
      expect(event.id).toBe("123e4567-e89b-12d3-a456-426655440000");
    });

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.post(
          `http://localhost:${availablePort}`,
          pushEventPayload,
          {
            headers: {
              "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
              "X-GitHub-Event": "push",
              "X-Hub-Signature":
                "sha1=f4d795e69b5d03c139cc6ea991ad3e5762d13e2f",
            },
          }
        );
      })
      .then((result: AxiosResponse) => {
        expect(result.status).toBe(200);
      })
      .catch((e: Error) => expect(e instanceof Error).toBe(true))
      .then(() => {
        server.close();
        clearTimeout(timeout);
      })

      .catch((e) => expect(e instanceof Error).toBeTruthy());
  });

  test("POST / with push event payload (no signature)", (t) => {
    const api = new Webhooks({
      secret: "mysecret",
    });
    const server = http.createServer(api.middleware);
    const errorHandler = jest.fn();
    api.on("error", errorHandler);

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.post(
          `http://localhost:${availablePort}`,
          pushEventPayload,
          {
            headers: {
              "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
              "X-GitHub-Event": "push",
            },
          }
        );
      })

      .then(() => {
        t.fail("should return a 400");
      })

      .catch((error: AxiosError) => {
        expect(error.response?.status).toBe(400);
      })

      .then(() => {
        expect(errorHandler).toHaveBeenCalled(); // calls "error" event handler
        server.close(t);
      })

      .catch((e) => expect(e instanceof Error).toBeTruthy());
  });

  test("POST / with push event payload (invalid signature)", (t) => {
    const api = new Webhooks({
      secret: "mysecret",
    });
    const server = http.createServer(api.middleware);
    const errorHandler = jest.fn();
    api.on("error", errorHandler);

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.post(
          `http://localhost:${availablePort}`,
          pushEventPayload,
          {
            headers: {
              "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
              "X-GitHub-Event": "push",
              "X-Hub-Signature": "sha1=foo",
            },
          }
        );
      })

      .then(() => {
        t.fail("should return a 400");
      })

      .catch((error: AxiosError) => {
        expect(error.response?.status).toBe(400);
      })

      .then(() => {
        expect(errorHandler).toHaveBeenCalled(); // calls "error" event handler
        server.close(t);
      })

      .catch((e) => expect(e instanceof Error).toBeTruthy());
  });

  test("POST / with hook error", (t) => {
    const api = new Webhooks({
      secret: "mysecret",
    });
    const server = http.createServer(api.middleware);

    api.on("push", () => {
      throw new Error("Oops");
    });

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.post(
          `http://localhost:${availablePort}`,
          pushEventPayload,
          {
            headers: {
              "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
              "X-GitHub-Event": "push",
              "X-Hub-Signature":
                "sha1=f4d795e69b5d03c139cc6ea991ad3e5762d13e2f",
            },
          }
        );
      })

      .then(() => {
        t.fail("should return a 500");
      })

      .catch((error: AxiosError) => {
        expect(error.response?.status).toBe(500);
      })

      .then(() => {
        server.close(t);
      })

      .catch((e) => expect(e instanceof Error).toBeTruthy());
  });

  test("POST / with timeout", async (t) => {
    expect.assertions(1);

    const clock = FakeTimers.install({
      toFake: ["setTimeout"],
    });

    const api = new Webhooks({
      secret: "mysecret",
    });
    const server = http.createServer(api.middleware);
    const tenSecondsInMs = 10 * 1000;

    api.on("push", async (event) => {
      await new Promise((resolve) => setTimeout(resolve, tenSecondsInMs));
    });

    promisify(server.listen.bind(server))(availablePort)

      .then(() => {
        return axios.post(
          `http://localhost:${availablePort}`,
          pushEventPayload,
          {
            headers: {
              "X-GitHub-Delivery": "123e4567-e89b-12d3-a456-426655440000",
              "X-GitHub-Event": "push",
              "X-Hub-Signature":
                "sha1=f4d795e69b5d03c139cc6ea991ad3e5762d13e2f",
            },
          }
        );
      })

      .then((result: AxiosResponse) => {
        expect(result.status).toBe(202);
      })
      .catch((error: AxiosError) => {
        expect(error.response?.status).toBe(400);
      })
      .then(() => {
        server.close();
        clock.uninstall();
      })

      .catch((error: AxiosError) => {
        expect(error.response?.status).toBe(400);
      });

    await clock.nextAsync();
    await clock.nextAsync();
    await clock.nextAsync();
    await clock.nextAsync();
  });
});
