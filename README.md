# 概要

> 本框架使用 Typescript 语言编写，集成 SWC 编译器
>
> 使用 NodeMon 与 tsx 作为启动器
>
> 本项目使用 **_yarn_** 包管理器
>
> 使用 Node 版本**_20.15.0_**

# 开发运行函数

开发模式

```sh
yarn dev
```

生产模式

```sh
yarn prod
```

构建函数

```sh
yarn build
```

运行构建代码

```sh
yarn start
```

# 数据库集成

✔ Mysql<br>
✔ Redis<br>
✔ MongoDB<br>
✔ Milvus<br>

# 功能集成

✔ 微服务集成<br>
✔ 全局日志<br>
✔ 日志旋转<br>
✔ 环境变量切换<br>
✔ JWT 身份校验<br>
✔ HTTP 请求限流<br>
✔ SDL 单设备登录<br>
✔ 数据缓存<br>
✔ 任务队列<br>
✔ 动态路由加载<br>
✔ 文件上传<br>
✔ 请求体校验<br>
✔ 请求缓存<br>
✔ 轻量 WebSocket 请求<br>
✔ SOCKET.IO<br>

# 可选库

> json-like-parse
>
> 用于解析 ai 等文本内的 json 与解析不完整的 json 文本

## 文件上传使用方法

### 前端

> 单文件上传

```TypeScript
const formData = new FormData();
formData.append('sampleFile', file);//sampleFile为自定义字段

axios.post('/upload', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
.then(function (response) {
    console.log('文件上传成功', response);
})
.catch(function (error) {
    console.log('文件上传失败', error);
});
```

---

> 多文件上传

```TypeScript
const formData = new FormData();
formData.append('file1', file);//文件1
formData.append('file2', file);//文件2
formData.append('file3', file);//文件3

axios.post('/upload', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
.then(function (response) {
    console.log('文件上传成功', response);
})
.catch(function (error) {
    console.log('文件上传失败', error);
});
```

### 后端

```TypeScript
export default (router: R, u: U) => {
  router.post("/file", u.upload(), async (req, res) => {
    const sampleFile = req.files.sampleFile; //读取上传的文件,sampleFile为前端传输的自定义字段
    const uploadPath = "uploads/" + sampleFile.name; //拼接保存路径
    //保存文件
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.serverError(err);
      res.success("uploadFile");
    });
  });
};
```

# MongoDB 使用说明

```TypeScript
u.mongo(name,schema)//表名 结构 返回 Model<T>类型
```

### 示例

```TypeScript
u.mongo("test", {
  userName: String,
  nickName: String,
  gender: Number,
  birthDay: Date,
  hobby: Array,
});
```

> 增

```TypeScript
const db = u.mongo("test");
const data = new db({
  userName: "LaLalA",
  nickName: "biubiu",
});
//执行save,保存数据
await data.save();
```

> 删

```TypeScript
const db = u.mongo("test");
//删除一条userName为'xz' 的数据
await db.remove({ userName: "xz" }, { single: true });

//删除全部的userName为'xz' 的数据
await db.remove({ userName: "xz" });

//删除一条userName为'JJI'的数据
await db.deleteOne({ userName: "JJI" });

//删除了userName为'DaLiDaLiDa'，并且nickName为'biubiu'的数据
await db.deleteMany({ userName: "DaLiDaLiDa", nickName: "biubiu" });
```

> 查

```Typescript
const db = u.mongo("test");
//查找一个 userName 为 xz 的数据。
await db.findOne({ userName: "xz" });

//查找全部 gender为 2 的数据。
await db.find({ gender: "2" }); //不填写条件返回全部数据

//限制查询
await db
  .find() //查询全部
  .or([{ gender: 2 }]) //查询gender为2的
  .sort({ createTime: -1 }) //倒序排列数据，时间倒序
  .limit(2) //展示两条，填写string类型
  .skip(2); //跳过前两个，填写string类型

const total = await db.countDocuments(); //查询总数，允许加条件
```

> 改

```Typescript
const db = u.mongo("test");
const data = await db.findOne({ userName: "DiDi" }); //找到userName为DiDi的要修改的内容
data.set({
  nickName: "DaDa", //将DD中nickName改为DaDa
});
data.save(); //提交至数据库
```

```Typescript
//$set
const db = u.mongo("Group");
db.updateOne({ id: 1 }, { $set: { state: 1 } });//更新id为1的数据，把state为1
```

```Typescript
//查找并更新
const db = u.mongo("test");
db.findOneAndUpdate(
  { nickName: "biubiu" }, //找到nickName为biubiu的数据
  { userName: "DaLiDaLiDa" }, //将该数据的userName改为DaLiDaLiDa
  { new: true }, //设为true显示为新数据
  (err, rs) => console.log(rs) //打印成功数据
);
```

# FFmpeg 在 Linux 下安装

> 务必使用 7.0 版本

```
sudo add-apt-repository ppa:ubuntuhandbook1/ffmpeg7
```

```
sudo apt update
```

```
sudo apt install ffmpeg
```
