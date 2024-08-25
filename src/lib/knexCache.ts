import { logger } from "@/lib/logger";
import redis from "@/DB/redis";
import { Knex } from "knex";

const cachePool = new Map();
const cacheTimerPool = new Map();

//knex装载器
async function redisInstall(knex: any) {
  knex.QueryBuilder.extend("cache", function (key: string, timeOut: number = 5 * 60) {
    key = key ?? this._single.table; //如果不传key默认为表名
    return cache(this, key, timeOut);
  });

  knex.QueryBuilder.extend("clearCache", function (key: string) {
    key = key ?? this._single.table;
    return clearCache(this, key);
  });
}

//获取缓存
async function getCache(key: string) {
  const cacheKey = `${key}:value`;
  if (process.env.KNEX_CACHE == "REDIS") {
    return await redis.get(cacheKey);
  } else {
    return cachePool.get(cacheKey);
  }
}

async function setCache(key: string, data: any, timeOut: number) {
  const cacheKey = `${key}:value`;
  if (process.env.KNEX_CACHE == "REDIS") {
    await redis.set(cacheKey, JSON.stringify(data), "EX", timeOut);
  } else {
    cachePool.set(cacheKey, JSON.stringify(data));

    // 清除之前的定时器
    if (cacheTimerPool.has(cacheKey)) {
      clearTimeout(cacheTimerPool.get(cacheKey));
    }

    // 设置新的定时器
    const timer = setTimeout(() => {
      cachePool.delete(cacheKey);
      cacheTimerPool.delete(cacheKey);
    }, timeOut * 1000);
    //设置过期时间
    cacheTimerPool.set(cacheKey, timer);
  }
}

//缓存
async function cache(knexQuery: Knex.QueryBuilder, key: string, timeOut: number) {
  const data = await getCache(key);
  if (data) {
    logger.trace(["DB", "Knex", "查询", "Cache"], `${key}:value`);
    return Promise.resolve(JSON.parse(data));
  }
  return knexQuery.then(async (data) => {
    logger.trace(["DB", "Knex", "设置", "Cache"], `${key}:value`);
    await setCache(key, data, timeOut);
    return data;
  });
}

//清除缓存
async function clearCache(knexQuery: Knex.QueryBuilder, key: string) {
  const data = await getCache(`${key}:value`);
  if (data) {
    logger.trace(["DB", "Knex", "删除", "Cache"], `${key}:value`);
    await redis.del(`${key}:value`);
  }
  return knexQuery;
}

export default redisInstall;
