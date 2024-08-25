import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

export default async function RoutesLoader(loadPath: string) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  loadPath = path.resolve(__dirname, "../", loadPath);
  // 检查路径是否存在
  if (!fs.existsSync(loadPath)) throw new Error(`路径 ${loadPath} 不存在`);

  const walk = (dir: string) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = dir + "/" + file;
      results.push({
        queueName: path.parse(file).name,
        path: file,
      });
    });
    return results;
  };

  const files = walk(loadPath); // 绝对路径数组

  const list = files.map(async (entry) => {
    const file = path.resolve(entry.path);
    if (fs.statSync(file).isFile() && [".js", ".ts"].indexOf(path.extname(file).toLowerCase()) !== -1 && path.basename(file).substr(0, 1) !== ".") {
      const fileUrl = pathToFileURL(file).href;
      return {
        file: fileUrl,
        name: entry.queueName,
        data: await import(fileUrl),
      };
    }
  });
  return await Promise.all(list);
}
