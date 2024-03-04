import { afterEach, describe, expect, it, jest } from "@jest/globals";
import axios from "axios";

import * as utils from "../src/internal/utils";

jest.mock("axios");

describe("Test Retry", () => {
  const retryConfig = new utils.RetryConfig(
    "backoff",
    new utils.BackoffStrategy(500, 60000, 1.5, 1000),
    true
  );

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it.each([{ status: 500 }, { status: 503 }])(
    "should retry and log warning on status code 5xx",
    async ({ status }) => {
      const warnSpy = jest.spyOn(global.console, "warn");
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.request.mockResolvedValue({ status: status });
      await utils.Retry(() => {
        return mockedAxios.request({
          validateStatus: () => true,
          url: `http://localhost:1234`,
          method: "post",
          responseType: "arraybuffer",
        });
      }, new utils.Retries(retryConfig, ["5xx"]));
      expect(warnSpy).toHaveBeenCalled();
    }
  );

  it("should throw on connection error", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.request.mockRejectedValue(new Error("socket hang up"));
    const t = async () =>
      await utils.Retry(() => {
        return mockedAxios.request({
          validateStatus: () => true,
          url: `http://localhost:1234`,
          method: "post",
          responseType: "arraybuffer",
        });
      }, new utils.Retries(retryConfig, ["5xx"]));

    expect(t).rejects.toThrowError("socket hang up");
  });
});
