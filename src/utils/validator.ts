import { RequestHandler, Request, Response, NextFunction } from "express";
import Joi from "joi";

// 错误信息翻译
const translateError = (error: Joi.ValidationError) => {
  return error.details.map((err) => {
    switch (err.type) {
      case "string.min":
        return `字段 ${err.context.label} 长度至少为 ${err.context.limit} 个字符。`;
      case "string.max":
        return `字段 ${err.context.label} 长度最多为 ${err.context.limit} 个字符。`;
      case "any.required":
        return `字段 ${err.context.label} 是必填项。`;
      case "string.pattern.base":
        return `字段 ${err.context.label} 格式无效。`;
      case "any.only":
        return `字段 ${err.context.label} 必须与 ${err.context.valids.join(", ")} 匹配。`;
      case "number.min":
        return `字段 ${err.context.label} 必须大于或等于 ${err.context.limit}。`;
      case "number.max":
        return `字段 ${err.context.label} 必须小于或等于 ${err.context.limit}。`;
      case "string.email":
        return `字段 ${err.context.label} 必须是有效的电子邮件地址。`;
      case "string.uri":
        return `字段 ${err.context.label} 必须是有效的 URI。`;
      case "number.base":
        return `字段 ${err.context.label} 必须是一个数字。`;
      case "date.base":
        return `字段 ${err.context.label} 必须是一个有效的日期。`;
      case "array.base":
        return `字段 ${err.context.label} 必须是一个数组。`;
      case "array.min":
        return `字段 ${err.context.label} 至少必须有 ${err.context.limit} 个元素。`;
      case "array.max":
        return `字段 ${err.context.label} 最多只能有 ${err.context.limit} 个元素。`;
      case "object.base":
        return `字段 ${err.context.label} 必须是一个对象。`;
      case "object.unknown":
        return `字段 ${err.context.label} 包含未知的键: ${err.context.child}.`;
      case "boolean.base":
        return `字段 ${err.context.label} 必须是布尔值。`;
      case "any.invalid":
        return `字段 ${err.context.label} 包含无效的值。`;
      case "any.empty":
        return `字段 ${err.context.label} 不能为空。`;
      case "string.length":
        return `字段 ${err.context.label} 长度必须为 ${err.context.limit} 个字符。`;
      case "number.integer":
        return `字段 ${err.context.label} 必须是整数。`;
      case "string.alphanum":
        return `字段 ${err.context.label} 只能包含字母和数字。`;
      case "string.base":
        return `字段 ${err.context.label} 必须是一个字符串。`;
      case "date.min":
        return `字段 ${err.context.label} 必须是 ${err.context.limit} 之后的日期。`;
      case "date.max":
        return `字段 ${err.context.label} 必须是 ${err.context.limit} 之前的日期。`;
      case "array.length":
        return `字段 ${err.context.label} 必须包含 ${err.context.limit} 个元素。`;
      case "object.length":
        return `字段 ${err.context.label} 必须包含 ${err.context.limit} 个键。`;
      case "object.min":
        return `字段 ${err.context.label} 至少必须包含 ${err.context.limit} 个键。`;
      case "object.max":
        return `字段 ${err.context.label} 最多只能包含 ${err.context.limit} 个键。`;
      case "object.and":
        return `字段 ${err.context.label} 必须同时包含 ${err.context.peers.join(", ")}。`;
      case "object.or":
        return `字段 ${err.context.label} 必须包含 ${err.context.peers.join(", ")} 中的至少一个。`;
      case "object.xor":
        return `字段 ${err.context.label} 不能同时包含 ${err.context.peers.join(", ")}。`;
      case "object.with":
        return `字段 ${err.context.label} 必须包含 ${err.context.peer}。`;
      case "object.without":
        return `字段 ${err.context.label} 不能包含 ${err.context.peer}。`;
      case "object.nand":
        return `字段 ${err.context.label} 不能同时包含 ${err.context.peers.join(", ")}。`;
      case "object.oxor":
        return `字段 ${err.context.label} 必须包含 ${err.context.peers.join(", ")} 中的一个或多个，但不能全部。`;
      default:
        return `字段 ${err.context.label} 无效。`;
    }
  });
};

export type vType = (fn: (joi: typeof Joi) => object | Joi.ObjectSchema<any>) => RequestHandler;

const validate: vType = (fn) => {
  const rule = fn(Joi);
  if (!rule) throw new Error("请填写校验规则");
  const schema = Joi.isSchema(rule) ? rule : Joi.object(rule);
  return (req: Request, res: Response, next: NextFunction) => {
    let data = {};
    if (req.method === "GET") data = req.query;
    if (req.method === "POST") data = req.body;
    const { error, value } = schema.validate(data, { abortEarly: false }); //abortEarly: false遇到错误继续检查全部,默认遇到错误停止
    if (error) {
      if (req.app.get("env") === "dev") {
        return res.errorBody(translateError(error), value);
      } else {
        return res.errorBody();
      }
    }
    next();
  };
};

export default validate as vType;
