export default (router: R, u: U) => {
  router.get("/", async (req, res) => {
    // 打印已注册的路由
    const item = (route: any) => ({
      path: route.path,
      methods: route.methods,
    });
    const routes = [];
    req.app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        routes.push(item(middleware.route));
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler: any) => {
          routes.push(item(handler.route));
        });
      }
    });
    if (req.app.get("env") == "dev") {
      res.success(routes, "全部路由"); //成功返回
    } else {
      res.success();
    }
  });
  //通过某种办法检测传入的值与类型

  router.post(
    "/test",
    u.v((joi) => ({
      username: joi.string().required(),
      data: joi
        .object({
          a: joi.string().required(),
        })
        .required(),
    })),
    async (req, res) => {
      const data =await u.knex("user") 
      console.log("%c Line:38 🍑 data", "background:#e41a6a", data);
      res.success();
    }
  );
};
