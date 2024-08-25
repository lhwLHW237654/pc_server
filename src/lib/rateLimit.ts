import rateLimitModule from "express-rate-limit";
import { rateLimitError } from "./resFnList";
import redis from "@/DB/redis";
import { Request, Response, NextFunction } from "express";

let captchaMiddleware = (req: Request, res: Response, next: NextFunction) => next();
let rateLimit = (req: Request, res: Response, next: NextFunction) => next();

if (process.env.RATELIMIT_ENABLED == "true") {
  const whiteLimitlist = process.env.RATELIMIT_WHITE_LIST.split(",").map((pattern) => new RegExp(pattern));
  // 检测是否解除限制
  captchaMiddleware = async (req, res, next) => {
    if (whiteLimitlist.some((regex) => regex.test(req.path))) return next();
    const token = req.headers.authorization;
    if (token) {
      // 使用 redis.get 来检查键是否存在，并且使用 await 等待结果
      const rate = await redis.get(`rate:${token}`);
      if (rate) return res.rateLimitError();
    }
    next();
  };

  // 限制请求频率
  rateLimit = rateLimitModule({
    windowMs: Number(process.env.RATELIMIT_TIME),
    max: Number(process.env.RATELIMIT_MAX),
    keyGenerator: function (req: Request) {
      // 如果没有token，返回null
      return req.headers.authorization || null;
    },
    handler: function (req: Request, res: Response) {
      // 设置自动恢复正常时间
      redis.set(`rate:${req.headers.authorization}`, `${new Date()}`, "EX", process.env.RATELIMIT_TIME);
      return res.rateLimitError();
    },
    skip: function (req: Request, res: Response) {
      // 如果请求路径在白名单中跳过限制
      return whiteLimitlist.some((regex) => regex.test(req.path));
    },
  });
}

export { rateLimit, captchaMiddleware };
