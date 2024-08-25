interface CaptchaOptions {
  size?: number; // 随机字符串的长度
  ignoreChars?: string; // 过滤掉一些字符，如 0o1i
  noise?: number; // 噪声线条数量
  color?: boolean; // 是否使用颜色
  background?: string; // SVG 图片的背景颜色
  width?: number; // 验证码的宽度
  height?: number; // 验证码的高度
  fontSize?: number; // 验证码文本的大小
  charPreset?: string; // 随机字符预设
}

interface Captcha {
  text: string;
  data: string; // SVG 字符串
}

interface CaptchaStatic {
  create(options?: CaptchaOptions): Captcha;
  createMathExpr(options?: CaptchaOptions): Captcha;
}

declare module 'svg-captcha' {
  const captcha: CaptchaStatic;
  export = captcha;
}