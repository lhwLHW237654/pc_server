import { logger } from "@/lib/logger";
import redisInstall from "@/lib/knexCache";
import knexClient, { Knex as KnexType } from "knex";

export interface Knex extends KnexType {}

let knex: KnexType | null = null;

if (process.env.MYSQL_ENABLED === "true") {
  // 安装 redis 前置器
  redisInstall(knexClient);
  knex = knexClient({
    client: "mysql",
    connection: {
      host: process.env.MYSQL_HOST as string,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER as string,
      password: process.env.MYSQL_PASSWORD as string,
      database: process.env.MYSQL_DATABASE as string,
    },
    //废弃功能
    // wrapIdentifier: (value, origImpl) => {
    //   const tablePrefix = "lc_"; //表前缀
    //   if (!value.includes(".")) {
    //     value = `${tablePrefix}${value}`;
    //   }
    //   return origImpl(value);
    // },
  });

  knex
    .raw("SELECT 1")
    .then(() => {
      logger.debug(["DB", "Knex"], `SQL连接成功，缓存模式：${process.env.KNEX_CACHE}`);
    })
    .catch((err: Error) => {
      knex = null;
      logger.warn(["DB", "Knex"], `SQL连接失败 ${err.message}`);
    });
  //hook修改表前缀
  knex.on("query-response", (res: any, query: any, req: any) => {
    let log = query.sql;
    if (query.bindings.length) log += `[参数]:${JSON.stringify(query.bindings)}`;
    logger.trace(["DB", "Knex"], log);
  });

  knex.on("query-error", (error: Error, query: any, res: any) => {
    let log = query.sql;
    if (query.bindings.length) log += `[参数]:${JSON.stringify(query.bindings)}`;
    logger.trace(["DB", "Knex"], log);
  });

  knex.on("error", (error: Error) => {
    logger.trace(["DB", "Knex"], error.message);
  });
}

export default knex as Knex;
