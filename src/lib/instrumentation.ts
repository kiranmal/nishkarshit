/**
 * Runs once when the Next.js server starts. Imports the default site content into an empty database (see lib/cms/auto-sync.ts)
 * so the admin panel always shows what the public website shows. Fire-and-forget: it never delays or breaks start-up.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { ensureContentSynced } = await import("@/lib/cms/auto-sync");
  void ensureContentSynced();
}
