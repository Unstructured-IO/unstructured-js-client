/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as shared from "../sdk/models/shared";
import { HTTPClient } from "./http";
import { RetryConfig } from "./retries";
import { Params, pathToFunc } from "./url";

/**
 * Hosted API Free
 */
export const ServerFreeApi = "free-api";
/**
 * Development server
 */
export const ServerDevelopment = "development";
/**
 * Contains the list of servers available to the SDK
 */
export const ServerList = {
    [ServerFreeApi]: "https://api.unstructured.io",
    [ServerDevelopment]: "http://localhost:8000",
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

    const params: Params = {};

    if (!serverURL) {
        const server = options.server ?? ServerFreeApi;
        serverURL = ServerList[server] || "";
    }

    const u = pathToFunc(serverURL)(params);
    return new URL(u);
}

export const SDK_METADATA = {
    language: "typescript",
    openapiDocVersion: "1.0.35",
    sdkVersion: "0.11.1",
    genVersion: "2.342.6",
    userAgent: "speakeasy-sdk/typescript 0.11.1 2.342.6 1.0.35 unstructured-client",
} as const;
