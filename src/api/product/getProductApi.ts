//查询产品中心
export default (router: R, u: U) => {
  router.get("/getProductApi", async (req, res) => {
    const data = await u.knex("cp_product").first();
    res.success(JSON.parse(data.data));
  });
};
