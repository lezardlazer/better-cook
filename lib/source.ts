export type SourceType = "web" | "youtube" | "tiktok" | "instagram";

export function detectSourceType(url: string): SourceType {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
  if (host.includes("tiktok.com")) return "tiktok";
  if (host.includes("instagram.com")) return "instagram";
  return "web";
}

export function assertFetchableUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("URL invalide.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Seules les URLs http/https sont acceptées.");
  }
  return parsed;
}
