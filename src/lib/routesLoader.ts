import express, { Express, Router } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import chalk from "chalk";

export default async function RoutesLoader(app: Express, loadPath: string, utils: U) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  loadPath = path.resolve(__dirname, "../", loadPath);
  // 检查路径是否存在
  if (!fs.existsSync(loadPath)) throw new Error(`路径 ${loadPath} 不存在`);

  const walk = (dir: string) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = dir + "/" + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        results.push({
          route: dir.replace(loadPath, "") || "/",
          path: file,
        });
      }
    });
    return results;
  };
  const files = walk(loadPath); // 绝对路径数组

  const routeToFileMap = new Map();
  const errorMap = new Map();
  for (const entry of files) {
    const file = path.resolve(entry.path);
    const route = entry.route;
    // 校验文件是否是合法
    if (fs.statSync(file).isFile() && [".js", ".ts"].indexOf(path.extname(file).toLowerCase()) !== -1 && path.basename(file).substr(0, 1) !== ".") {
      const fileUrl = pathToFileURL(file).href;
      const router = express.Router();
      const routeModule = await import(fileUrl);
      await routeModule.default(router, utils);
      app.use(route, router);
      //重复路由检查
      if (process.env.CHECK_REPEAT_ROUTE === "true") {
        router.stack.forEach((layer) => {
          if (layer.route) {
            const method = Object.keys((layer.route as any).methods)[0].toUpperCase();
            const fullPath = route + layer.route.path;
            const routeSignature = `${method} ${fullPath}`;
            if (!routeToFileMap.has(routeSignature)) {
              routeToFileMap.set(routeSignature, []);
            } else {
              errorMap.set(routeSignature, routeToFileMap.get(routeSignature));
            }
            routeToFileMap.get(routeSignature).push(file);
          }
        });
      }
    }
  }
  if (process.env.CHECK_REPEAT_ROUTE === "true") {
    errorMap.forEach((files, routeSignature) => {
      console.error(chalk.redBright(`路由重复: ${routeSignature}\n错误位置:\n${files.join("\n")}\n`));
    });
  }
}
