import MarkdownEditor from "@/components/MarkdownEditor";
import { getLdClient } from "@/lib/launchdarkly";
import type { LDContext } from "@launchdarkly/node-server-sdk";
import { cookies } from "next/headers";

/*
Server component to evaluate LaunchDarkly flags before first render.
Evaluates flags from LaunchDarkly based on the sessionid and pass
that to the MarkdownEditor.
*/

export default async function Home() {
  //read 'ld-session-id' cookie and fallback if not present
  const cookieStore = await cookies();
  const sessionId =
    cookieStore.get("ld-session-id")?.value ?? "anonymous-fallback";

  const client = getLdClient();

  const context: LDContext = {
    kind: "user",
    key: sessionId,
    anonymous: true,
  };

  let premiumEnabled = false; //default: button hidden
  let summaryStyle: "short" | "detailed" = "short"; //default

  if (client) {
    try {
      premiumEnabled = await client.boolVariation(
        "premium-enabled",
        context,
        false,
      );

      summaryStyle = (await client.stringVariation(
        "summary-style",
        context,
        "short",
      )) as "short" | "detailed";
    } catch (error) {
      console.error("Failed to fetch LD flags", error);
    }
  }

  return (
    <MarkdownEditor
      premiumEnabled={premiumEnabled}
      summaryStyle={summaryStyle}
    />
  );
}
