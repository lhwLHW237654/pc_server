//上传图片
export default (router: R, u: U) => {
  router.post("/uploaImage", u.upload(), async (req, res) => {
    if (!req.files) return res.error("上传文件为空");
    const sampleFile = req.files.sampleFile; //读取上传的文件,sampleFile为前端传输的自定义字段
    const data = {
      name: sampleFile.name,
      size: sampleFile.size,
      create_time: new Date().getTime(),
    };
    const uploadPath = "public"; //拼接保存路径 //保存文件
    await u.upload.mv(sampleFile, uploadPath, sampleFile.name);
    // 获取cp_data表中的数据
    const cpData = await u.knex("cp_data").select("data").where("id", 1);
    if (cpData && cpData.length > 0) {
      let datas = JSON.parse(cpData[0].data);
      for (let obj of datas) {
        if (obj.component === "videoBox") {
          obj.data.options.src = sampleFile.name;
          break;
        }
      }
      await u
        .knex("cp_data")
        .update({ data: JSON.stringify(data) })
        .where("id", 1);
    }
    await u.knex("cp_files").update(data).where("id", 1);
    res.success("上传成功");
  });
};
