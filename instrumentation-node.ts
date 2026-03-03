/*
instrumentation-node keeps the import boundary clean. imports only at runtime and in Node.
importing in the Edge will cause our build to fail because the LD SDK requires functions such as fs which are not available in the Edge runtime.
*/

import { initLD } from "@/lib/launchdarkly";

export async function register() {
  await initLD();
}
