import "knex";

declare module "knex" {
  namespace Knex {
    interface QueryBuilder {
      /**
       * 缓存到redis中
       * @param key 缓存key,使用':'分级
       * @param timeOut 过期时间(秒) 默认300秒5分钟
       * @example
       * redis(`key:key2`,3000);
       */
      cache(key: string, timeOut?: number): Promise<any>;
      clearCache(key: string): Promise<any>;
    }
  }
}
