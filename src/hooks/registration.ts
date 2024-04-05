import { Hooks } from "./types";

import { LogRetryHook } from "./custom/LogRetryHook";
import { SplitPdfHook } from "./custom/SplitPdfHook";

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
  const logErrorHook = new LogRetryHook();
  const splitPdfHook = new SplitPdfHook();

  // Register SDK init hooks
  hooks.registerSDKInitHook(splitPdfHook);

  // Register before request hooks
  hooks.registerBeforeRequestHook(splitPdfHook);

  // Register after success hooks
  hooks.registerAfterSuccessHook(splitPdfHook);

  // Register after error hooks
  hooks.registerAfterErrorHook(splitPdfHook);
  hooks.registerAfterErrorHook(logErrorHook);
}
