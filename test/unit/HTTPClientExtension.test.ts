import { describe, it, expect, vi } from 'vitest';
import { HTTPClient } from '../../src/lib/http.js';
import { HTTPClientExtension } from '../../src/hooks/custom/common.js';

describe('HTTPClientExtension', () => {
  it('should use custom HTTPClient when provided', async () => {
    // Create a custom HTTPClient with a mock request method
    const customClient = new HTTPClient();
    const mockRequest = vi.fn().mockResolvedValue(new Response('custom response'));
    customClient.request = mockRequest;

    // Create HTTPClientExtension with custom client
    const extension = new HTTPClientExtension(customClient);

    // Make a request (not the no-op URL)
    const testUrl = 'https://api.example.com/test';
    const testRequest = new Request(testUrl);
    const response = await extension.request(testRequest);

    // Verify the custom client's request method was called
    expect(mockRequest).toHaveBeenCalled();
    expect(mockRequest.mock.calls[0][0].url).toBe(testUrl);
    expect(await response.text()).toBe('custom response');
  });

  it('should handle no-op URL regardless of base client', async () => {
    // Create a custom HTTPClient
    const customClient = new HTTPClient();
    const mockRequest = vi.fn().mockResolvedValue(new Response('should not be called'));
    customClient.request = mockRequest;

    // Create HTTPClientExtension with custom client
    const extension = new HTTPClientExtension(customClient);

    // Make a no-op request
    const noOpRequest = new Request('https://no-op/');
    const response = await extension.request(noOpRequest);

    // Verify the custom client was NOT called for no-op URL
    expect(mockRequest).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK_NO_OP');
    expect(await response.text()).toBe('{}');
    expect(response.headers.get('fake-response')).toBe('fake-response');
  });

  it('should work without custom client', async () => {
    // Create HTTPClientExtension without custom client
    const extension = new HTTPClientExtension();

    // Make a no-op request
    const noOpRequest = new Request('https://no-op/');
    const response = await extension.request(noOpRequest);

    // Verify no-op handling works
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK_NO_OP');
  });

  it('should execute hooks even when delegating to base client', async () => {
    // Create a custom HTTPClient
    const customClient = new HTTPClient();
    const mockRequest = vi.fn().mockResolvedValue(new Response('custom response', { status: 200 }));
    customClient.request = mockRequest;

    // Create HTTPClientExtension with custom client
    const extension = new HTTPClientExtension(customClient);

    // Add a response hook to track if it's called
    let hookCalled = false;
    let hookSeenStatus = 0;
    extension.addHook("response", (res) => {
      hookCalled = true;
      hookSeenStatus = res.status;
    });

    // Make a request
    const testRequest = new Request('https://api.example.com/test');
    await extension.request(testRequest);

    // Verify the hook was called even though we're using a base client
    expect(hookCalled).toBe(true);
    expect(hookSeenStatus).toBe(200);
  });

  it('should execute error logging hook for failed requests', async () => {
    // Create a custom HTTPClient that returns an error response
    const customClient = new HTTPClient();
    const mockRequest = vi.fn().mockResolvedValue(new Response('error', { status: 500 }));
    customClient.request = mockRequest;

    // Create HTTPClientExtension with custom client
    const extension = new HTTPClientExtension(customClient);

    // Add the same error logging hook that SplitPdfHook adds
    const errorLogs: string[] = [];
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      errorLogs.push(args.join(' '));
    });

    extension.addHook("response", (res) => {
      if (res.status != 200) {
        console.error("Request failed with status code", `${res.status}`);
      }
    });

    // Make a request that will fail
    const testRequest = new Request('https://api.example.com/test');
    await extension.request(testRequest);

    // Verify the error was logged (proving hooks execute)
    expect(errorLogs.length).toBeGreaterThan(0);
    expect(errorLogs[0]).toContain('Request failed with status code 500');

    consoleErrorSpy.mockRestore();
  });
});
