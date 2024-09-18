//上传图片
export default (router: R, u: U) => {
  router.post("/uploaImage", u.upload(), async (req, res) => {
    if (!req.files) return res.error("上传文件为空");
    const sampleFile = req.files.sampleFile; //读取上传的文件,sampleFile为前端传输的自定义字段
    const data = {
      group: u.uuid(),
      name: sampleFile.name,
      create_time: new Date().getTime(),
      update_time: new Date().getTime(),
    };
    const uploadPath = "public"; //拼接保存路径 //保存文件
    await u.upload.mv(sampleFile, uploadPath, sampleFile.name);
    await u.knex("cp_files").insert(data);
    res.success(data.group, "上传成功");
  });
};
