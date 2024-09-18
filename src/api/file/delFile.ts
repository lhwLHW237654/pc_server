import path from "path";
import { promises as fs, createReadStream } from "fs";

export default (router: R, u: U) => {
  //获取文件池文件信息
  router.post(
    "/delFile",
    u.v((joi) => ({
      id: joi.string().required(),
      fileId: joi.number().required(),
    })),
    async (req, res) => {
      const { id, fileId } = req.body;
      const file = await u.knex("cp_files").where("id", fileId).where("group", id).first();
      if (!file) return res.error("文件不存在");
      // const filePath = path.join(process.cwd(), "uploads", file.file);
      // await fs.unlink(filePath);
      await u.knex("cp_files").where("id", fileId).where("group", id).update({ state: 1 });
      res.success("文件删除成功");
    }
  );
};
