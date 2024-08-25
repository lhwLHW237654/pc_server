import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);

app.use(cors());

//socket实例
let socketInstance = null;

//新建Io接口Router
function io(namespace = "/") {
  if (!socketInstance) {
    throw new Error("Socket.io未初始化");
  }
  const ns = socketInstance.of(namespace);
  ns.use(verify);
  return ns;
}

//前置中间件
function verify(socket, next) {
  next();
}

//初始化socket
function socketInit() {
  socketInstance = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return httpServer;
}

export { io, socketInit };
