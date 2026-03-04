import { init } from "@launchdarkly/node-server-sdk";
import { randomUUID } from "crypto";

async function main() {
  const client = init(process.env.LAUNCHDARKLY_SDK_KEY!);
  await client.waitForInitialization();

  const SIMULATIONS = 100;

  for (let i = 0; i < SIMULATIONS; i++) {
    const context = { kind: "user" as const, key: `sim-${randomUUID()}` };

    // Let LD assign the variant — this is what records the flag evaluation
    const variant = await client.variation("summary-style", context, "short");

    // Simulate scores with a slight bias toward detailed being higher
    const base = variant === "detailed" ? 65 : 52;
    const score = Math.min(
      100,
      Math.max(1, base + Math.floor((Math.random() - 0.5) * 30)),
    );

    client.track("summary-engagement", context, undefined, score);
  }

  await client.flush();
  await client.close();
  console.log(`Simulated ${SIMULATIONS} sessions`);
}

main();
