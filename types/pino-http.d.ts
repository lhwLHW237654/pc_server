declare module "pino-http" {
  import { Request, Response, NextFunction } from "express";
  import { Logger, LoggerOptions } from "pino";

  interface HttpLogger {
    (req: Request, res: Response, next: NextFunction): void;
    logger: Logger;
  }

  interface Options extends LoggerOptions {
    level?: string;
    quietReqLogger?: Boolean;
    customLogLevel?: (req: Request, err: Error) => void;
    genReqId?: () => void;
  }

  function pinoHttp(options?: Options): HttpLogger;

  export default pinoHttp;
}
