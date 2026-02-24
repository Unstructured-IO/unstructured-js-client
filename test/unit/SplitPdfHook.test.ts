import { describe, it, expect, vi } from 'vitest';
import { HTTPClient } from '../../src/lib/http.js';
import { SplitPdfHook } from '../../src/hooks/custom/SplitPdfHook.js';
import { HTTPClientExtension } from '../../src/hooks/custom/common.js';

describe('SplitPdfHook', () => {
  it('should use custom HTTPClient configuration in sdkInit', () => {
    // Create a custom HTTPClient with specific configuration
    const customClient = new HTTPClient();
    const mockRequest = vi.fn();
    customClient.request = mockRequest;

    // Create SplitPdfHook and initialize it with custom client
    const hook = new SplitPdfHook();
    const result = hook.sdkInit({
      baseURL: new URL('https://api.example.com'),
      client: customClient,
    });

    // Verify the hook returns a client
    expect(result.client).toBeDefined();
    expect(result.baseURL).toEqual(new URL('https://api.example.com'));

    // Verify the hook's internal client is an HTTPClientExtension (not the raw base client)
    expect(hook.client).toBeInstanceOf(HTTPClientExtension);
  });

  it('should preserve custom client configuration when making requests', async () => {
    // Create a custom HTTPClient that tracks if it was called
    const customClient = new HTTPClient();
    let customClientCalled = false;
    const originalRequest = customClient.request.bind(customClient);

    customClient.request = async (request: Request) => {
      customClientCalled = true;
      // For non-no-op requests, the custom client should be called
      if (request.url !== 'https://no-op/') {
        return new Response('custom client response');
      }
      return originalRequest(request);
    };

    // Create SplitPdfHook and initialize with custom client
    const hook = new SplitPdfHook();
    hook.sdkInit({
      baseURL: new URL('https://api.example.com'),
      client: customClient,
    });

    // Make a non-no-op request through the hook's client
    const testRequest = new Request('https://api.example.com/test');
    const response = await hook.client!.request(testRequest);

    // Verify custom client was used
    expect(customClientCalled).toBe(true);
    expect(await response.text()).toBe('custom client response');
  });

  it('should handle no-op URL even with custom client', async () => {
    // Create a custom HTTPClient
    const customClient = new HTTPClient();
    let customClientCalled = false;
    customClient.request = async () => {
      customClientCalled = true;
      return new Response('should not be called for no-op');
    };

    // Create SplitPdfHook and initialize with custom client
    const hook = new SplitPdfHook();
    hook.sdkInit({
      baseURL: new URL('https://api.example.com'),
      client: customClient,
    });

    // Make a no-op request
    const noOpRequest = new Request('https://no-op/');
    const response = await hook.client!.request(noOpRequest);

    // Verify custom client was NOT called for no-op URL
    expect(customClientCalled).toBe(false);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK_NO_OP');
  });
});
