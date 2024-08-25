import { v4 as uuidv4 } from "uuid";
import pinoHttp from "pino-http";
import { Request } from "express";
import _ from "lodash";

const httpLogger = pinoHttp({
  level: "trace",
  quietReqLogger: true,
  transport: {
    targets: [
      {
        target: "pino-http-print",
        level: process.env.LOGGER_PRINT_LEVEL ?? "debug",
        options: {
          all: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          relativeUrl: false,
        },
      },
      {
        target: "@jvddavid/pino-rotating-file",
        level: "trace",
        options: {
          path: "logs",
          pattern: "%Y-%M-%d.log",
          maxSize: 1024 * 1024 * 10,
          sync: false,
          fsync: false,
          append: true,
          mkdir: true,
        },
      },
    ],
  },
  customLogLevel: (res: Request, err: Error | undefined) => {
    const statusCode = res.statusCode;
    if (statusCode >= 400 && statusCode < 500) {
      return "warn";
    } else if (statusCode >= 500) {
      return "error";
    }
    return "info";
  },
  genReqId() {
    return uuidv4();
  },
  serializers: {
    req(req) {
      req.body = req.raw.body;
      return req;
    },
    res(res) {
      res.body = res.raw.body;
      return res;
    },
  },
});

type Type = string | Array<string>;

type loggerType = {
  /**
   * 静默日志
   */
  trace: (type: Type, data: any) => void;
  /**
   * 调试日志
   */
  debug: (type: Type, data: any) => void;
  /**
   * 信息日志
   */
  info: (type: Type, data: any) => void;
  /**
   * 警告日志
   */
  warn: (type: Type, data: any) => void;
  /**
   * 错误日志
   */
  error: (type: Type, data: any) => void;
  /**
   * 致命日志
   */
  fatal: (type: Type, data: any) => void;
};

const logger: loggerType = {
  trace: (type: Type, data: any) => httpLogger.logger.trace(formatLog(type, data)),
  debug: (type: Type, data: any) => httpLogger.logger.debug(formatLog(type, data)),
  info: (type: Type, data: any) => httpLogger.logger.info(formatLog(type, data)),
  warn: (type: Type, data: any) => httpLogger.logger.warn(formatLog(type, data)),
  error: (type: Type, data: any) => httpLogger.logger.error(formatLog(type, data)),
  fatal: (type: Type, data: any) => httpLogger.logger.fatal(formatLog(type, data)),
};

//原始替换函数
function replacer(_, value: any) {
  if (typeof value === "undefined") {
    return "[UNDEFINED]";
  }
  if (typeof value === "symbol") {
    return `[SYMBOL: ${value.toString()}]`;
  }
  if (typeof value === "function") {
    return `[FUNCTION: ${value.toString()}]`;
  }
  if (value instanceof RegExp) {
    return `[REGEX: ${value.toString()}]`;
  }
  if (typeof value === "number" && isNaN(value)) {
    return "[NaN]";
  }
  return value;
}

function formatLog(type: Type, data: any) {
  let formatType = "";
  if (_.isString(type)) {
    formatType = `[${replacer(null, type)}]`;
  }
  if (_.isArray(type)) {
    formatType = (type as Array<string>).map((item) => `[${replacer(null, item)}]`).join("");
  }
  const formatData = JSON.stringify(data, replacer, 2).replace(/\n/g, "\n");
  return formatType + ":" + formatData;
}

export default httpLogger;
export { logger, loggerType };
