export default (router: R, u: U) => {
  router.post(
    "/login",
    u.v((joi) => {
      return {
        username: joi.string().required(),
        password: joi.string().required(),
        captcha: joi.string().required(),
        originalCaptcha: joi.string().required(),
      };
    }),
    async (req, res) => {
      const { username, password, captcha, originalCaptcha } = req.body;
      if (u.md5(captcha + process.env.SALT_CAPTCHA) != originalCaptcha) return res.error("验证码错误");
      const data = await u.knex("cp_admin").select("id", "name", "user_name", "password").where("user_name", "=", username).first();
      if (!data) return res.error("登录失败");
      if (data.password == u.md5(password) && data.user_name == username) {
        const token = u.setToken({
          id: data.id,
          username: data.username,
          name: data.name,
        });

        res.success({ token: token, name: data.name }, "登录成功");
      } else {
        res.error("用户名或密码错误");
      }
    }
  );
};
