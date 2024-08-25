import { Request, Response, NextFunction } from "express";
import * as resFnList from "./resFnList";
import createError from "http-errors";

//规定响应头
function support(req: Request, res: Response, next: NextFunction) {
  res.createError = (...args: any[]) => next(createError(...args));
  for (const name in resFnList) {
    res[name] = ((...args: any[]) => {
      const data = resFnList[name](...args);
      data.id = req.id;
      res.status(data.code).send(data);
    }).bind(res);
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  support(req, res, next);
  next();
};
