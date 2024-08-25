import { logger } from "../lib/logger.js";
import { io as socketIo } from "../lib/socketInit.js";

//定义路径
const io = socketIo("/");

io.on("connection", async (socket) => {
  logger.info(["Socket", "连接"], socket.id);
  socket.on("disconnect", async () => {
    logger.info(["Socket", "断开"], socket.id);
  });
});
