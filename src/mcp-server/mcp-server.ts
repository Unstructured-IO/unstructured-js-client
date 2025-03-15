/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { buildApplication, buildRouteMap, run } from "@stricli/core";
import process from "node:process";
import { buildContext } from "./cli.js";
import { startCommand } from "./cli/start/command.js";

const routes = buildRouteMap({
  routes: {
    start: startCommand,
  },
  docs: {
    brief: "MCP server CLI",
  },
});

export const app = buildApplication(routes, {
  name: "mcp",
  versionInfo: {
    currentVersion: "0.22.1",
  },
});

run(app, process.argv.slice(2), buildContext(process));
