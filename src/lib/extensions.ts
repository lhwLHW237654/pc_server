// responseExtensions.ts
import type { Response, Request, NextFunction } from "express";
import * as resFnList from "./resFnList";
import createError from "http-errors";

// 扩展 Response 类型定义
declare module "express-serve-static-core" {
  interface Response {
    createError(...args: any[]): void;
    [key: string]: any;
  }
}

// 扩展 Response 原型
(Response.prototype as any).createError = function (...args: any[]) {
  const next: NextFunction = (this as any).next;
  next(createError(...args));
};

for (const name in resFnList) {
  (Response.prototype as any)[name] = function (...args: any[]) {
    const req: Request = (this as any).req;
    const data = resFnList[name](...args);
    data.id = req.id;
    this.status(data.code).send(data);
  };
}
