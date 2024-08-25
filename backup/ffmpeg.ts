import { md5 } from "js-md5";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

// 将 MP4 转换为 TS 文件
const convertMP4toTS = async (input: string, output: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions(["-c copy", "-bsf:v h264_mp4toannexb", "-f mpegts"])
      .output(output)
      .on("end", () => resolve(output))
      .on("error", reject)
      .run();
  });
};

/**
 * 拼接声音
 * @param inputsPath 输入声音集合路径
 * @param outputPath 输出路径
 * @returns
 */
export function concatAudio(inputsPath: Array<string>, outputPath: string) {
  const renderer = ffmpeg();
  inputsPath.forEach((path) => {
    renderer.addInput(path);
  });
  return renderer.mergeToFile(outputPath, "F:\\novel_serve\\temp");
}

/**
 * 裁剪视频到指定分辨率
 * @param inputPath 输入视频路径
 * @param output 输出视频路径
 * @param tsPath ts文件路径
 * @param duration 视频时长
 * @param cropRatio 裁剪比例
 */
export async function cropVideo(inputs: Array<string>, output: string, tsPath: string, cropRatio?: any) {
  // 拼接 TS 文件并转换为 MP4
  const concatTSAndConvertToMP4 = async (inputs: string[], output: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const command = ffmpeg();
      command.input(`concat:${inputs.join("|")}`);
      // command.outputOptions(["-c copy", "-bsf:a aac_adtstoasc"]);
      // duration: number = 0
      // if (duration > 0) {
      //   command.setStartTime("00:00:00").setDuration(duration);
      // }
      // 如果设置了裁剪比例，添加裁剪过滤器
      if (cropRatio) {
        // 解析宽高比
        const [w, h] = cropRatio.split(":").map(Number);
        command.videoFilters(`crop=${w}:${h}`);
        // const aspectRatio = w / h;
        // command.videoFilters([
        //   {
        //     filter: "crop",
        //     options: {
        //       w: Number(w),
        //       h: Number(h),
        //     },
        //   },
        // ]);
      }
      command.output(output);
      command.on("start", function (commandLine) {
        console.log(" 🥤", commandLine);
      });
      command.on("end", () => resolve());
      command.on("error", (err) => reject(err));
      command.run();
    });
  };

  const tsFiles: string[] = [];
  for (const input of inputs) {
    const tsOutput = tsPath + `\\${md5(input)}.ts`;
    const tsFile = await convertMP4toTS(input, tsOutput);
    tsFiles.push(tsFile);
  }

  await concatTSAndConvertToMP4(tsFiles, output);
}

/**
 * 视频添加音频
 * @param videoPath 视频路径
 * @param audioPath 音频路径
 * @param outputPath 输出路径
 * @returns
 */
export function videoAddAudioSrt(videoPath: string, audioPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions(["-map", "0:v:0", "-map", "1:a:0"])
      .audioCodec("copy")
      .videoCodec("copy")
      .outputOptions("-shortest")
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

/**
 * 添加字幕
 * @param videoPath 视频路径
 * @param srtPath 字幕路径
 * @param outputPath 输出路径
 * @returns
 */
export function srtTovideo(videoPath: string, srtPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    let formattedSrtPath = path.normalize(srtPath).replace(/\\/g, "/");
    formattedSrtPath = formattedSrtPath.replace(/:/g, "\\:").replace(/'/g, "\\'");
    ffmpeg()
      .input(videoPath)
      .outputOptions([`-vf subtitles='${formattedSrtPath}'`])
      .on("start", function (commandLine) {
        console.log(" 🥤", commandLine);
      })
      .on("end", () => {
        resolve(true);
      })
      .on("error", (err) => {
        reject(err);
      })
      .output(outputPath)
      .run();
  });
}
