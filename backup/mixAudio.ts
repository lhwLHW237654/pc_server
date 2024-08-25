// 合成音频;
// await new Promise((resolve, reject) => {
//     const renderer = ffmpeg();
// 初始化累计延迟时间
//     let cumulativeDelay = 0;

// 构建ffmpeg的输入和滤镜链
//     let filterComplex = '';
//     audioFiles.forEach((audioData, index) => {
//       renderer.input(audioData.path);
//       const delay = cumulativeDelay ? `${cumulativeDelay}` : "0";
//       filterComplex += `[${index}:a]adelay=${delay}|${delay}[a${index}];`;
//       cumulativeDelay += audioData.duration;
//     });

// 将所有的音频流混合到一起
//     filterComplex += audioFiles.map((_, index) => `[a${index}]`).join('') + `concat=n=${audioFiles.length}:v=0:a=1[out]`;

// 应用滤镜链并指定输出
//     renderer.inputOption('-filter_complex', filterComplex);
//     renderer.outputOption('-map [out]').output(tempAudio);
//     renderer.on("start", (commandLine) => {
//       console.log("🍪", commandLine);
//     });
//     renderer.on("error", (err) => reject(err));
//     renderer.on("end", () =>
//       audioFiles.forEach((audioItem) =>
//         fs.unlink(audioItem.path, (err) => {
//           if (err) return reject(err);
//           resolve(true);
//         })
//       )
//     );
//     renderer.run();
//   });

// 合成音频;
// await new Promise((resolve, reject) => {
//     const renderer = ffmpeg();
//     // 初始化累计延迟时间
//     let cumulativeDelay = 0;

//     // 构建ffmpeg的输入和滤镜链
//     let filterComplex = '';
//     audioFiles.forEach((audioData, index) => {
//       renderer.input(audioData.path);
//       // 将秒转换为毫秒
//       const delay = cumulativeDelay * 1000; // 秒转毫秒
//       filterComplex += `[${index}:a]adelay=${delay}|${delay}[a${index}];`;
//       cumulativeDelay += audioData.duration; // 累加延迟时间（秒）
//     });

//     // 将所有的音频流混合到一起
//     filterComplex += audioFiles.map((_, index) => `[a${index}]`).join('') + `concat=n=${audioFiles.length}:v=0:a=1[out]`;

//     // 应用滤镜链并指定输出
//     renderer.inputOption('-filter_complex', filterComplex);
//     renderer.outputOption('-map [out]').output(tempAudio);
//     renderer.on("start", (commandLine) => {
//       console.log("🍪", commandLine);
//     });
//     renderer.on("error", (err) => reject(err));
//     renderer.on("end", () =>
//       audioFiles.forEach((audioItem) =>
//         fs.unlink(audioItem.path, (err) => {
//           if (err) return reject(err);
//           resolve(true);
//         })
//       )
//     );
//     renderer.run();
//   });
