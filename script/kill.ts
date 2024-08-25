import chalk from "chalk";
import readline from "readline";
import killSync from "kill-sync";
import { logger } from "@/lib/logger";
import { portToPid } from "pid-port";
import fs from "fs";

const port = process.env.HTTP_PORT || 3000;

function log(msg: string) {
  console.log(chalk.redBright(msg));
}

export default async (err: Error) => {
  logger.fatal(["Serve", "API", "错误"], `端口 ${port} 已被占用，等待重启...`);
  if ((err as any).code === "EADDRINUSE") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    // 询问用户
    rl.question(chalk.redBright(`端口 ${port} 已被占用，是否结束进程并重新启动？ (Y/N)`), async (answer) => {
      if (answer.toUpperCase() === "Y" || answer === "") {
        const pid = await portToPid(Number(port));
        if (!pid) return log(`未找到端口:${port} 对应的进程`);
        killSync(pid);
        log(`端口:${port} PID:${pid} 对应的进程已结束`);
        log(`后端重启中...`);
        fs.writeFile("script/restart.ts", String(Date.now()), "utf8", async (err) => {
          if (err) return log(`后端重启失败，请手动重启`);
          await new Promise((resolve) => setTimeout(resolve, 50));
          fs.unlink("script/restart.ts", (err) => {
            if (err) return log(`后端重启失败，请手动重启`);
          });
        });
      }
      rl.close();
    });
  }
};
