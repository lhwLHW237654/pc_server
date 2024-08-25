export default (router: R, u: U) => {
  router.get("/getRouteData", async (req, res) => {
    const data = await u.knex("cp_auth").select("cp_auth.data").first();
    res.success(JSON.parse(data.data));
  });
};
