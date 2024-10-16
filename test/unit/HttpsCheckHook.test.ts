import { HttpsCheckHook } from "../../src/hooks/custom/HttpsCheckHook";
import { HTTPClient } from "../../src/lib/http";
import { describe, it, expect, vi, afterEach } from 'vitest';

describe("HttpsCheckHook", () => {
  const consoleSpy = vi.spyOn(global.console, "warn");

  afterEach(() => {
    consoleSpy.mockClear();
  });

  it.each([
    { url: "http://example.unstructuredapp.io" },
    { url: "ws://example.unstructuredapp.io" },
  ])(
    "should update the protocol to HTTPS if the base hostname matches '*.unstructuredapp.io' and the protocol is not HTTPS",
    ({ url }) => {
      const baseURL = new URL(url);
      const client = new HTTPClient();
      const opts = { baseURL, client };
      const hook = new HttpsCheckHook();

      const result = hook.sdkInit(opts);

      expect(result.baseURL?.protocol).toBe("https:");
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    }
  );

  it("should not update the protocol to HTTPS if the base hostname doesn't match '*.unstructuredapp.io'", () => {
    const baseURL = new URL("http://example.someotherdomain.com");
    const client = new HTTPClient();
    const opts = { baseURL, client };
    const hook = new HttpsCheckHook();

    const result = hook.sdkInit(opts);

    expect(result.baseURL?.protocol).toBe("http:");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should not update the protocol to HTTPS if the base hostname matches '*.unstructuredapp.io' and the protocol is HTTPS", () => {
    const baseURL = new URL("https://example.unstructuredapp.io");
    const client = new HTTPClient();
    const opts = { baseURL, client };
    const hook = new HttpsCheckHook();

    const result = hook.sdkInit(opts);

    expect(result.baseURL?.protocol).toBe("https:");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should not update anything if URL is null", () => {
    const baseURL = null;
    const client = new HTTPClient();
    const opts = { baseURL, client };
    const hook = new HttpsCheckHook();

    const result = hook.sdkInit(opts);

    expect(result.baseURL).toBeNull();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should update the pathname to empty", () => {
    const baseURL = new URL("https://example.unstructuredapp.io/general/v0/general");
    const client = new HTTPClient();
    const opts = { baseURL, client };
    const hook = new HttpsCheckHook();

    const result = hook.sdkInit(opts);

    expect(result.baseURL?.pathname).toBe("/");
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
