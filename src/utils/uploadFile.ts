import { RequestHandler } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import pathModule from "path";

interface IOptions {
  useTempFiles: boolean;
  tempFileDir: string;
  debug: boolean;
  logger: object;
}

interface fileType {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: false;
  mimetype: string;
  md5: string;
  mv: Function;
}

export type uploadType = {
  (options?: Partial<IOptions>): RequestHandler;
  /**
   * 移动文件函数
   * @param file 文件实例
   * @param path 保存路径
   * @param name 文件名
   */
  mv(file: fileType, path: string, name: string): Promise<boolean | Error>;
};

const upload = ((options?: Partial<IOptions>) => {
  const defaultOptions: IOptions = {
    useTempFiles: true,
    tempFileDir: "temp",
    debug: true,
    logger: {
      log: (msg: string) => {
        msg = msg.replace("Express-file-upload", "[Mid][file][upload]");
        console.debug(msg);
      },
    },
  };

  const mergedOptions: IOptions = {
    ...defaultOptions,
    ...options,
  };

  if (process.env.FILEUPLOAD_DEBUG === "true") {
    mergedOptions.debug = true;
  }

  return fileUpload(mergedOptions);
}) as uploadType;

upload.mv = async (file, path, name) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path, { recursive: true });
    file.mv(pathModule.join(path, name), (err: Error) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};
export default upload as uploadType;
