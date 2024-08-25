export default (router: R, u: U) => {
  router.get("/getCaptcha", async (req, res) => {
    const options = {
      mathMin: 1, //数学表达式的最小值
      mathMax: 1, // 数学表达式的最大值
      mathOperator: "+",
      noise: 10, // 干扰线条的数量
      color: true,
    };
    let captcha = u.captcha.createMathExpr(options);
    const data: any = { svg: captcha.data, captcha: u.md5(captcha.text + process.env.SALT_CAPTCHA) };
    if (req.app.get("env") === "dev") {
      data.key = captcha.text;
    }
    res.success(data);
  });
};
