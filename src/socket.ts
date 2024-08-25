//意外错误处理
import "./lib/processEvent";

//加载环境变量
import "./env/loadEnvs";

import { logger } from "./lib/logger";
import { socketInit } from "./lib/socketInit";

const server = socketInit();

const port = process.env.SOCKET_PORT || 9000;
server.listen(port, async () => {
  import("./socket/index.js");
  logger.debug(["Serve", "Socket"], `启动成功 ${port}`);
});
