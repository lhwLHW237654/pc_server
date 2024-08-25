import * as express from "express";
import * as resFnList from "@/lib/resFnList";

type ResponseFunctions = {
  [K in keyof typeof resFnList]: (typeof resFnList)[K];
};

interface User {
  id: number;
  name: string;
  username: string;
  identity: string;
  auth_id: number;
  phone: string;
}

declare global {
  namespace Express {
    interface Response extends ResponseFunctions {}

    interface Request {
      user?: User; // 添加 user 属性
      files?: any;
    }
  }
}
