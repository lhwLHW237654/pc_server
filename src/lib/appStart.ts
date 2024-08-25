import { spawn } from "child_process";

export default (cmd: string, args: Array<string> = []) => {
  try {
    const ls = spawn(cmd, args);

    ls.stdout.on("data", (data) => {
      console.log(`标准输出:\n${data}`);
    });

    ls.stderr.on("data", (data) => {
      console.error(`标准错误输出:\n${data}`);
    });

    ls.on("error", (err) => {
      console.error(`子进程启动失败: ${err.stack}`);
    });

    ls.on("close", (code) => {
      console.log(`子进程退出，退出码 ${code}`);
    });
  } catch (err) {
    console.error(`无法启动子进程: ${err.stack}`);
  }
};
