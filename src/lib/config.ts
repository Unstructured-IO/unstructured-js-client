/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as shared from "../sdk/models/shared";
import { HTTPClient } from "./http";
import { RetryConfig } from "./retries";
import { pathToFunc } from "./url";

/**
 * Hosted API
 */
export const ServerProd = "prod";
/**
 * Development server
 */
export const ServerLocal = "local";
/**
 * Contains the list of servers available to the SDK
 */
export const ServerList = {
    [ServerProd]: "https://api.unstructured.io",
    [ServerLocal]: "http://localhost:8000",
} as const;

export type SDKOptions = {
    /**
     * The security details required to authenticate the SDK
     */
    security?: shared.Security | (() => Promise<shared.Security>);

    httpClient?: HTTPClient;
    /**
     * Allows overriding the default server used by the SDK
     */
    server?: keyof typeof ServerList;
    /**
     * Allows overriding the default server URL used by the SDK
     */
    serverURL?: string;
    /**
     * Allows overriding the default retry config used by the SDK
     */
    retryConfig?: RetryConfig;
};

export function serverURLFromOptions(options: SDKOptions): URL | null {
    let serverURL = options.serverURL;

    const params: Record<string, string> = {};

    if (!serverURL) {
        const server = options.server ?? ServerProd;
        serverURL = ServerList[server] || "";
    }

    const u = pathToFunc(serverURL)(params);
    return new URL(u);
}

export const SDK_METADATA = Object.freeze({
    language: "typescript",
    openapiDocVersion: "0.0.1",
    sdkVersion: "0.11.3",
    genVersion: "2.281.2",
    userAgent: "speakeasy-sdk/typescript 0.11.3 2.281.2 0.0.1 unstructured-client",
});
