import { Router } from "express";
import { Worker, Job, DefaultJobOptions, WorkerOptions, ConnectionOptions } from "bullmq";
import { types } from "joi";
import * as Utils from "@/utils";
type UtilsType = {
  [K in keyof typeof Utils]: (typeof Utils)[K];
};

interface newWorker extends WorkerOptions {
  connection?: ConnectionOptions;
}

// 将类型声明为全局类型
declare global {
  type R = Router;
  type U = UtilsType;
  type Job = Job;
  type BullConfig = {
    init?: DefaultJobOptions;
    worker?: newWorker;
  };
  type W = Worker;
}
