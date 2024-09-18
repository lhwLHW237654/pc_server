import path from "path";
import { promises as fs, createReadStream } from "fs";

export default (router: R, u: U) => {
  //获取文件池文件信息
  router.post(
    "/dowFile",
    u.v((joi) => ({
      name: joi.string().required(),
    })),
    async (req, res) => {
      const { name } = req.body;
      // 防止路径遍历攻击
      const safeName = path.basename(name);
      const filePath = path.join(process.cwd(), "uploads", safeName);
      try {
        // 检查文件是否存在并获取文件信息
        const stat = await fs.stat(filePath);

        // 设置适当的响应头
        res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Length", stat.size);

        // 使用流来发送文件
        const readStream = createReadStream(filePath);
        readStream.pipe(res);

        readStream.on("error", (error) => {
          res.error("文件读取错误");
        });
      } catch (err) {
        if (err.code === "ENOENT") {
          res.error("文件不存在");
        }
      }
    }
  );
};
