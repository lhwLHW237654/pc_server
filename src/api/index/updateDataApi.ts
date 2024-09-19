export default (router: R, u: U) => {
  //调试页面
  router.post(
    "/updateDataApi",
    u.v((joi) => ({
      formData: joi.array().required(),
    })),
    async (req, res) => {
      const { formData } = req.body;
      const data = {
        data: JSON.stringify(formData),
      };
      await u.knex("cp_data").update(data).where("id", 1);
      res.success("保存成功");
    }
  );
};
