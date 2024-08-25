import Redis from "ioredis";
import { logger } from "@/lib/logger";

let redis: Redis | null = null;

if (process.env.REDIS_ENABLED == "true") {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  });
  let error = false;
  redis.on("error", (err) => {
    if (!error) {
      error = true;
      logger.warn(["DB", "Redis"], `连接失败 ${err}`);
    }
  });

  redis.on("connect", () => {
    error = false;
    logger.debug(["DB", "Redis"], `连接成功`);
  });
}

export { Redis };
export default redis as Redis;
