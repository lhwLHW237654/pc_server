import { config } from "dotenv";
import chalk from "chalk";

//加载环境变量
const env = process.env.NODE_ENV;
if (!env) {
  console.error(chalk.bgRedBright.black("[启动后端][环境变量为空]"));
  process.exit(1);
} else {
  config({ path: `env/.env.${env}` });
  console.log(chalk.bgGreenBright.black(`[启动后端][环境变量]`) + " " + chalk.greenBright(env));
}
