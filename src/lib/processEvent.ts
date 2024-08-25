import chalk from "chalk";
function log(msg: string) {
  console.log(chalk.bgRedBright.black("[后端进程]") + chalk.redBright(msg));
}

process.on("unhandledRejection", async (reason, promise) => {
  log(`[System][错误]:未处理的 Promise 拒绝\n\n${reason}`);
  console.error(promise);
});

// 捕捉意外错误
process.on("uncaughtException", (err) => {
  log(`[System][错误]:意外错误\n\n${err.stack}`);
});

//结束进程
process.on("SIGINT", () => {
  log(`[System][SIGINT][结束]:用户主动结束进程`);
  process.exit();
});

process.on("SIGTERM", () => {
  log(`[System][SIGTERM][结束]:被其他程序结束进程`);
  process.exit();
});

process.on("exit", (code) => {
  log(`[System][EXIT][结束]:进程结束运行 代码${code}`);
});
