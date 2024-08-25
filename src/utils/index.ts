import { md5 } from "js-md5"; // md5
md5 as (str: string) => string;
export { md5 };
import { v4 as uuid } from "uuid"; //uuid
uuid as () => string;
export { uuid };
import { logger } from "@/lib/logger";
export { logger };
import knex from "@/DB/knex"; //Mysql
export { knex };
import redis from "@/DB/redis"; // Redis
export { redis };
import upload from "./uploadFile"; // 文件上传服务中间件
export { upload };
import { setToken } from "@/lib/token";
export { setToken };
import v from "./validator"; //ai
export { v };
import captcha from "svg-captcha";
captcha as CaptchaStatic;
export { captcha };
