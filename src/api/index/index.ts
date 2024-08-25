//上传图片
export default (router: R, u: U) => {
  router.post("/slideshow", u.upload(), async (req, res) => {
    if (!req.files) return res.error("上传文件为空");
    const sampleFile = req.files.sampleFile; //读取上传的文件,sampleFile为前端传输的自定义字段
    const data = {
      name: sampleFile.name,
      format: sampleFile.mimetype,
      create_time: new Date().getTime(),
      update_time: new Date().getTime(),
    };
    const uploadPath = "public"; //拼接保存路径 //保存文件
    await u.upload.mv(sampleFile, uploadPath, sampleFile.name);
    res.success(sampleFile, "上传成功");
  });
};
