import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import redis from "@/DB/redis";
import knex from "@/DB/knex";

const tableName = process.env.TOKEN_TABLE ?? "user";

export function vToken(req: Request, res: Response, next: NextFunction) {
  const headers = req.headers;
  if (process.env.TOKEN_ENABLED == "false") return next(); //如果没有设置token不进行判断
  const whiteLimitlist = process.env.TOKEN_WHITE_LIST.split(",").map((pattern) => new RegExp(pattern)); //白名单
  if (whiteLimitlist.some((regex) => regex.test(req.path))) return next(); //如果在白名单中不进行判断
  if (!headers.authorization) return res.tokenError();
  jwt.verify(headers.authorization, process.env.TOKEN_SECRET, async (err: VerifyErrors, payload: JwtPayload) => {
    if (err) {
      return res.tokenError();
    }
    if (process.env.TOKEN_SDL == "true") {
      const redisToken = await redis.get(`${tableName}:${payload.data.id}`);
      if (redisToken != headers.authorization) return res.SDL();
    }
    if (process.env.TOKEN_BANNED == "true") {
      const value = await knex(`${tableName}`).where(`${tableName}.id`, "=", payload.data.id).first().cache(`${tableName}:id:${payload.data.id}`);
      const key = process.env.TOKEN_BANNED_KEY ?? "banned";
      if (!value[key]) return res.accountBanned();
    }
    req.user = payload.data;
    next();
  });
}

export type setTokenType = (data: any) => string;

export const setToken = ((data: any) => {
  if (process.env.TOKEN_ENABLED == "false") return null;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_TIME) * 24 * 60 * 60,
      data,
    },
    process.env.TOKEN_SECRET
  );
  redis.set(`${tableName}:${data.id}`, token);
  return token;
}) as setTokenType;
