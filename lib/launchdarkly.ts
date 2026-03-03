import * as ld from "@launchdarkly/node-server-sdk";

/*
  LaunchDarkly Singleton
  - ensures only one instance of launchdarkly ever exists
  - allows for easy access from one point
    - we use this INSTEAD of a UI state management library like Zustand because this needs to be accessible by server code.
*/

declare global {
  var __ldClient: ld.LDClient | undefined;
}

export async function initLD(): Promise<void> {
  if (globalThis.__ldClient) return; //already initialized

  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  if (!sdkKey) {
    console.warn("LAUNCHDARKLY_SDK_KEY environment variable not set");
    return;
  }

  const client = ld.init(sdkKey);
  try {
    await client.waitForInitialization({ timeout: 5 });
    globalThis.__ldClient = client;
    console.log("LaunchDarkly initialized");
  } catch (e) {
    console.error("Failed to initialize LaunchDarkly", e);
  }
}

export function getLdClient(): ld.LDClient | undefined {
  return globalThis.__ldClient;
}
