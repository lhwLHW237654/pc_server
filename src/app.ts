//意外错误处理
import "@/lib/processEvent";
//加载环境变量
import "@/lib/loadEnv";

if (process.env.DEV_AUTO_SOCKET == "true") {
  import("@/socket"); //自动加载socket
}
import express, { Request, Response, NextFunction, Express } from "express";
import "express-async-errors";
import createError from "http-errors";
import cors from "cors";
import httpLogger, { logger } from "@/lib/logger";
import routesLoader from "@/lib/routesLoader";
import supports from "@/lib/supports";
import * as utils from "@/utils/index";
import { rateLimit, captchaMiddleware } from "@/lib/rateLimit";
import { vToken } from "@/lib/token";
import chalk from "chalk";
import killProt from "#/script/kill";

const app: Express = express();
// 设置渲染引擎
app.set("views", "views");
app.set("view engine", "ejs");

//跨域
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "50mb" })); //格式化为json
app.use(express.urlencoded({ extended: false })); //格式化为url编码
app.use("public", express.static("public")); //静态资源
app.use(httpLogger); //日志记录

app.use((req: Request, res: Response, next: NextFunction) => supports(req, res, next)); //规范响应请求头

//频繁请求限制
app.use(rateLimit); //限制频率
app.use(captchaMiddleware); //检查是否通过人机校验

//token验证
app.use(vToken); //校验token

await routesLoader(app, "api", utils); //自动注册/路由*

// 捕捉404错误并转发到错误处理程序
app.use((req, res, next) => {
  next(createError(404));
});

interface CustomError extends Error {
  status?: number;
}
// 错误处理
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error(["Serve", "API", "错误"], err);
  if (req.app.get("env") === "dev") {
    err.status = err.status || 500;
    res.locals.message = err.message;
    res.locals.error = err;
    //渲染错误页面
    res.status(err.status).render("error");
    console.error(chalk.redBright("地址: " + req.path));
    console.error(chalk.redBright("状态: " + err.status));
    console.error(chalk.redBright(err.stack));
  } else {
    res.serverError();
  }
});

const port = process.env.HTTP_PORT || 3000;
const server = app.listen(port, () => {
  logger.debug(["Serve", "API"], `服务启动成功 ${port}`);
});

server.on("error", killProt);
