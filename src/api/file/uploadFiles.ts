import path from "path";

export default (router: R, u: U) => {
  router.post("/uploadFiles", u.upload(), async (req, res) => {
    const { id } = req.body;
    if (!id) return res.error("组编号为空");
    if (!req.files) return res.error("文件为空");
    for (const key in req.files) {
      const item = req.files[key];
      // 解码文件名
      const decodedFileName = decodeURIComponent(item.name);
      const uuidFileName = u.uuid() + path.extname(decodedFileName);
      const uploadPath = `uploads/${uuidFileName}`; // 拼接保存路径
      await new Promise<void>((resolve, reject) => {
        item.mv(uploadPath, async (err: Error) => {
          if (err) reject();
          await u.knex("cp_files").insert({
            group: id,
            name: decodedFileName, // 使用解码后的文件名
            file: uuidFileName,
            size: item.size,
            state: 0,
            create_time: Date.now(),
          });
          resolve();
        });
      });
    }
    setTimeout(() => {
      res.success("文件上传成功");
    }, 1000);
  });
};
