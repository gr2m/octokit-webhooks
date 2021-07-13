import { createLogger } from "../../src/createLogger.js";

const noop = () => {};

describe("createLogger", () => {
  jest.spyOn(console, "warn").mockImplementation(noop);
  jest.spyOn(console, "error").mockImplementation(noop);

  describe("when nothing is passed", () => {
    it("provides default implementations for all log levels", () => {
      const logger = createLogger();

      expect(() => logger.debug("hello world")).not.toThrow();
      expect(() => logger.info("hello world")).not.toThrow();
      expect(() => logger.warn("hello world")).not.toThrow();
      expect(() => logger.error("hello world")).not.toThrow();
    });
  });

  describe("when some log levels are provided", () => {
    const partialLogger = {
      debug: jest.fn(),
      error: jest.fn(),
    };

    it("uses the provided implementations for the given log levels", () => {
      const logger = createLogger(partialLogger);

      logger.debug("hello world");
      logger.error("hello world");

      expect(partialLogger.debug).toHaveBeenCalledTimes(1);
      expect(partialLogger.debug).toHaveBeenCalledWith("hello world");

      expect(partialLogger.error).toHaveBeenCalledTimes(1);
      expect(partialLogger.error).toHaveBeenCalledWith("hello world");
    });

    it("provides default implementations for the remaining log levels", () => {
      const logger = createLogger(partialLogger);

      expect(() => logger.info("hello world")).not.toThrow();
      expect(() => logger.warn("hello world")).not.toThrow();
    });
  });
});
