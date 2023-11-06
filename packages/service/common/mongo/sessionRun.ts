import mongoose from './index';

/**
 * MongoDB会话类
 */
export class MongoSession {
  /**
   * 任务列表
   */
  tasks: (() => Promise<any>)[] = [];

  /**
   * MongoDB会话对象
   */
  session: mongoose.mongo.ClientSession | null = null;

  /**
   * 选项对象
   */
  opts: {
    session: mongoose.mongo.ClientSession;
    new: boolean;
  } | null = null;

  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 初始化会话
   */
  async init() {
    this.session = await mongoose.startSession();
    this.opts = { session: this.session, new: true };
  }

  /**
   * 添加任务
   * @param tasks 任务列表
   */
  push(
    tasks: ((opts: {
      session: mongoose.mongo.ClientSession;
      new: boolean;
    }) => () => Promise<any>)[] = []
  ) {
    if (!this.opts) return;
    // this.tasks = this.tasks.concat(tasks.map((item) => item(this.opts)));
  }

  /**
   * 执行任务
   */
  async run() {
    if (!this.session || !this.opts) return;
    try {
      this.session.startTransaction();

      const opts = { session: this.session, new: true };

      await this.session.commitTransaction();
    } catch (error) {
      await this.session.abortTransaction();
      console.error(error);
    }
    this.session.endSession();
  }
}