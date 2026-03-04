import { streamText } from "ai";
import { getLdClient } from "@/lib/launchdarkly";
import type { LDContext } from "@launchdarkly/node-server-sdk";
import { cookies } from "next/headers";

const PROMPTS: Record<"short" | "detailed", string> = {
  short:
    "You are a concise summarizer. Summarize the following markdown content in 2-3 sentences. Be direct and clear.",
  detailed:
    "You are a thorough analyst. Summarize the following markdown content with a structured, comprehensive breakdown. Cover the main topics, key details, and conclusions. Use clear sections if the content warrants it.",
};

export async function POST(req: Request) {
  const { prompt, summaryStyle } = (await req.json()) as {
    prompt: string;
    summaryStyle: "short" | "detailed";
  };

  const cookieStore = await cookies();
  const sessionId =
    cookieStore.get("session-id")?.value ?? "anonymous-fallback";
  const context: LDContext = { kind: "user", key: sessionId, anonymous: true };

  //generate engagement score before streaming
  const engagementScore = Math.floor(Math.random() * 100) + 1;

  const result = streamText({
    model: "anthropic/claude-haiku-4.5",
    system: PROMPTS[summaryStyle] ?? PROMPTS.short,
    prompt,
    onFinish: async () => {
      const ldClient = getLdClient();
      if (ldClient) {
        ldClient.track(
          "summary-engagement",
          context,
          undefined,
          engagementScore,
        );
      }
    },
  });

  return result.toTextStreamResponse({
    headers: {
      "X-Engagement-Score": String(engagementScore),
    },
  });
}
