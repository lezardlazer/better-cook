import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface VideoMetadata {
  title: string;
  description: string;
  uploader?: string;
  thumbnail?: string;
}

async function fetchVideoMetadataRemote(
  url: string,
  serviceUrl: string,
): Promise<VideoMetadata> {
  const response = await fetch(new URL("/metadata", serviceUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.YTDLP_SERVICE_TOKEN
        ? { Authorization: `Bearer ${process.env.YTDLP_SERVICE_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Le service d'extraction a échoué (HTTP ${response.status}).`);
  }

  return response.json();
}

async function fetchVideoMetadataLocal(url: string): Promise<VideoMetadata> {
  const { stdout } = await execFileAsync(
    "yt-dlp",
    ["--dump-json", "--no-warnings", "--skip-download", "--", url],
    { maxBuffer: 1024 * 1024 * 20, timeout: 30_000 },
  );

  const data = JSON.parse(stdout);
  return {
    title: data.title ?? "",
    description: data.description ?? "",
    uploader: data.uploader,
    thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : undefined,
  };
}

export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  const serviceUrl = process.env.YTDLP_SERVICE_URL;
  return serviceUrl
    ? fetchVideoMetadataRemote(url, serviceUrl)
    : fetchVideoMetadataLocal(url);
}
