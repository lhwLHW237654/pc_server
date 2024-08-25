/**
 * 成功回调
 * @param data 数据
 * @param message 提示消息
 * @returns {Object} 响应对象
 */
export function success(data: any = null, message: any = "成功") {
  return {
    code: 200,
    data,
    message,
  };
}

/**
 * 客户端错误响应
 * @param message 错误消息
 * @param data 数据
 * @returns {Object} 响应对象
 */
export function error(message: any = "", data: any = null) {
  return {
    code: 400,
    data,
    message,
  };
}

/**
 * 客户端无法解析请求实体
 * @param message 错误消息-默认参数错误
 * @param data 数据
 * @returns {Object} 响应对象
 */
export function errorBody(message: any = "参数错误", data: any = null) {
  return {
    code: 422,
    data,
    message,
  };
}

/**
 * 服务器错误响应
 * @param data 数据
 * @returns {Object} 响应对象
 */
export function serverError(data: any = null) {
  return {
    code: 500,
    message: "服务器错误",
    data,
  };
}

/**
 * 用户信息错误响应
 * @returns {Object} 响应对象
 */
export function tokenError(data: any = null) {
  return {
    code: 401,
    message: "用户信息错误",
    data: data,
  };
}

/**
 * 账号被封禁响应
 * @returns {Object} 响应对象
 */
export function accountBanned(data: any = null) {
  return {
    code: 403,
    data: data,
    message: "账号已被封禁，详情请联系客服",
  };
}

/**
 * 账号异地登录响应
 * @returns {Object} 响应对象
 */
export function SDL(data: any = null) {
  return {
    code: 409,
    data: data,
    message: "账号在其他地方被登录",
  };
}

/**
 * 身份验证错误响应
 * @returns {Object} 响应对象
 */
export function signError(data: any = null) {
  return {
    code: 401,
    data: data,
    message: "身份验证错误",
  };
}

/**
 * 频繁请求错误响应
 * @returns {Object} 响应对象
 */
export function rateLimitError(data: any = null) {
  return {
    code: 429,
    data: data,
    message: "频繁请求",
  };
}

/**
 * 请求过载错误响应
 * @returns {Object} 响应对象
 */
export function serverOverload(data: any = null) {
  return {
    code: 503,
    data: data,
    message: "当前请求人数过多，稍后再试试吧",
  };
}
