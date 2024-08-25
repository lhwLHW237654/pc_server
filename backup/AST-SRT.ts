import { logger } from "@/lib/logger";
import axios from "axios";
import fs from "fs";

export type SRTType = (originalText: string, text: string) => Promise<any>;

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const milliseconds = ms % 1000;
  return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60)
    .toString()
    .padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`;
}

function generateSrt(originalText: string, text: string, timestamp: number[][]) {
  console.log("%c Line:18 🍡 timestamp", "background:#465975", timestamp);
  const originalSplitText = originalText.split(/(?<=[。！？，])/);
  const originalCleanedText = originalSplitText.map((s) => s.replace(/[。！？，]/g, ""));

  const splitText = text.split(/(?<=[。！？，])/);
  const cleanedText = splitText.map((s) => s.replace(/[。！？，]/g, ""));

  let srtContent = ""; //srt文件内容
  let index = 1; //序号
  let len = 0;
  cleanedText.forEach((sentence, i) => {
    const time = [...timestamp].splice(len, sentence.length).flat();
    console.log("%c Line:36 🍭 originalCleanedText[i]", "background:#2eafb0", originalCleanedText[i]);
    console.log("%c Line:29 🥖 sentence", "background:#b03734", sentence);
    console.log("%c Line:30 🍢 time", "background:#b03734", [...timestamp].splice(len, sentence.length));
    len += sentence.length;
    srtContent += `${index}\n`;
    srtContent += `${formatTime(time[0])} --> ${formatTime(time[time.length - 1])}\n`;
    srtContent += `${sentence}\n\n`;

    index++;
  });
  return srtContent;
}

export default (async (originalText, path) => {
  try {
    const audioData = new FormData();
    const fileBuffer = fs.readFileSync(path);
    audioData.append("audio", new Blob([fileBuffer]));
    const response = await axios.post("http://192.168.2.6:9666/recognize", audioData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response.data || !response.data.result) {
      throw new Error("SRT请求失败");
    }
    const data = response.data.result[0];
    const srtData = generateSrt(originalText, data.text, data.timestamp);
    return srtData;
  } catch (error) {
    logger.error(["TTS", "请求失败"], error);
  }
}) as SRTType;
