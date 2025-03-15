import { Hooks } from "./types.js";

import { LoggerHook } from "./custom/LoggerHook.js";
import { SplitPdfHook } from "./custom/SplitPdfHook.js";
import { HttpsCheckHook } from "./custom/HttpsCheckHook.js";

/*
 * This file is only ever generated once on the first generation and then is free to be modified.
 * Any hooks you wish to add should be registered in the initHooks function. Feel free to define them
 * in this file or in separate files in the hooks folder.
 */

export function initHooks(hooks: Hooks) {
  // Add hooks by calling hooks.register{ClientInit/BeforeRequest/AfterSuccess/AfterError}Hook
  // with an instance of a hook that implements that specific Hook interface
  // Hooks are registered per SDK instance, and are valid for the lifetime of the SDK instance

  // Initialize hooks
  const loggerHook = new LoggerHook();
  const splitPdfHook = new SplitPdfHook();
  const httpsCheckHook = new HttpsCheckHook();

  // NOTE: logger_hook should stay registered last as logs the status of
  // request and whether it will be retried which can be changed by e.g. split_pdf_hook

  // Register SDK init hooks
  hooks.registerSDKInitHook(httpsCheckHook);
  hooks.registerSDKInitHook(splitPdfHook);

  // Register before request hooks
  hooks.registerBeforeRequestHook(splitPdfHook);

  // Register after success hooks
  hooks.registerAfterSuccessHook(splitPdfHook);
  hooks.registerAfterSuccessHook(loggerHook)

  // Register after error hooks
  hooks.registerAfterErrorHook(splitPdfHook);
  hooks.registerAfterErrorHook(loggerHook);
}
