/*
instrumentation is a nextjs hook that runs once at server-startup and not per request.
this serves as the entry point for initializing LaunchDarkly in our app and is the standard
for initialzing any monitoring/logging tools.
*/
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { register } = await import("./instrumentation-node");
    await register();
  }
}
