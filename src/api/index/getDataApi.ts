export default (router: R, u: U) => {
    router.get("/getDataApi", async (req, res) => {
      const data = await u.knex("cp_data").select("cp_data.data").first();
      res.success(JSON.parse(data.data));
    });
  };