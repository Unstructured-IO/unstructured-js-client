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
    const testRequest = new Request('https://api.example.com/test');
    const response = await extension.request(testRequest);

    // Verify the custom client's request method was called
    expect(mockRequest).toHaveBeenCalledWith(testRequest);
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
});
