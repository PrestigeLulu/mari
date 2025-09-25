import { spawn, spawnSync } from "child_process";
import { createAudioResource } from "@discordjs/voice";

export function playWithYtDlp(url: string) {
  console.log("URL 추출 중...");
  const ytdlp = spawn("yt-dlp", [
    "-f",
    "bestaudio",
    "-o",
    "-",
    "--quiet",
    "--no-playlist", // 플레이리스트 불러오는 시간 방지
    "--no-warnings",
    url,
  ]);

  // URL 직접 사용
  return createAudioResource(ytdlp.stdout);
}
