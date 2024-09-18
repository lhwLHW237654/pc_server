export default (router: R, u: U) => {
  //获取文件池文件信息
  router.get(
    "/getFileList",
    u.v((joi) => ({
      id: joi.string().required(),
      page: joi.number().optional().min(1), //页码
      limit: joi.number().optional().min(1), //每页数量
      select: joi.string().optional().allow(""), //查询条件
    })),
    async (req, res) => {
      const { id, page = 1, limit = 10, select }: any = req.query; //获取参数
      const offset = (page - 1) * limit; //计算偏移量
      const totalData = await u
        .knex("cp_files")
        .where("cp_files.state", 0)
        .andWhere("cp_files.group", id)
        .andWhere((qb) => {
          if (select) {
            qb.andWhere((subQb) => {
              subQb.where("name", "like", `%${select}%`);
            });
          }
        })
        .count("* as total")
        .first();
      const data = await u
        .knex("cp_files")
        .where("cp_files.state", 0)
        .andWhere("cp_files.group", id)
        .andWhere((qb) => {
          if (select) {
            qb.andWhere((subQb) => {
              subQb.where("name", "like", `%${select}%`);
            });
          }
        })
        .offset(offset)
        .limit(limit);
      const total = totalData.total;
      res.success({ data, total });
    }
  );
};
