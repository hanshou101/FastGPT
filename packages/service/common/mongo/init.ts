import mongoose from './index';
import 'winston-mongodb';
import { createLogger, format, transports } from 'winston';

/**
 * connect MongoDB and init data
 *
 * 连接 MongoDB 并初始化数据
 *
 * @param beforeHook - 连接前的钩子函数
 * @param afterHook - 连接后的钩子函数
 */
export async function connectMongo({
  beforeHook,
  afterHook
}: {
  beforeHook?: () => any;
  afterHook?: () => any;
}): Promise<void> {
  if (global.mongodb) {
    return;
  }
  global.mongodb = mongoose;

  beforeHook && (await beforeHook());

  // logger
  initLogger();

  console.log('mongo start connect');
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URI as string, {
      bufferCommands: true,
      maxConnecting: Number(process.env.DB_MAX_LINK || 5),
      maxPoolSize: Number(process.env.DB_MAX_LINK || 5),
      minPoolSize: 2,
      connectTimeoutMS: 20000,
      waitQueueTimeoutMS: 20000
    });

    console.log('mongo connected');

    afterHook && (await afterHook());
  } catch (error) {
    console.log('error->', 'mongo connect error', error);
    global.mongodb = undefined;
  }
}

/**
 * 初始化日志记录器
 */
function initLogger() {
  global.logger = createLogger({
    transports: [
      new transports.MongoDB({
        db: process.env.MONGODB_URI as string,
        collection: 'server_logs',
        options: {
          useUnifiedTopology: true
        },
        cappedSize: 500000000,
        tryReconnect: true,
        metaKey: 'meta',
        format: format.combine(format.timestamp(), format.json())
      }),
      new transports.Console({
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.printf((info) => {
            if (info.level === 'error') {
              console.log(info.meta);
              return `[${info.level.toLocaleUpperCase()}]: ${[info.timestamp]}: ${info.message}`;
            }
            return `[${info.level.toLocaleUpperCase()}]: ${[info.timestamp]}: ${info.message}${
              info.meta ? `: ${JSON.stringify(info.meta)}` : ''
            }`;
          })
        )
      })
    ]
  });
}