import express from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, existsSync } from "node:fs";

const execFileAsync = promisify(execFile);
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;
const COOKIES_PATH = "/tmp/cookies.txt";

if (process.env.YTDLP_COOKIES) {
  writeFileSync(COOKIES_PATH, process.env.YTDLP_COOKIES);
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/metadata", async (req, res) => {
  if (SERVICE_TOKEN) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${SERVICE_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const { url } = req.body ?? {};
  if (typeof url !== "string" || !url) {
    return res.status(400).json({ error: "Missing url" });
  }

  const args = ["--dump-json", "--no-warnings", "--skip-download"];
  if (existsSync(COOKIES_PATH)) {
    args.push("--cookies", COOKIES_PATH);
  }
  args.push("--", url);

  try {
    const { stdout } = await execFileAsync("yt-dlp", args, {
      maxBuffer: 1024 * 1024 * 20,
      timeout: 30_000,
    });
    const data = JSON.parse(stdout);
    res.json({
      title: data.title ?? "",
      description: data.description ?? "",
      uploader: data.uploader,
      thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : undefined,
    });
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : "yt-dlp failed" });
  }
});

app.listen(PORT, () => {
  console.log(`yt-dlp service listening on port ${PORT}`);
});
