import { connectionMongo, type Model } from '../../common/mongo';

// 引入必要的模块
const { Schema, model, models } = connectionMongo;
import { hashStr } from '@fastgpt/global/common/string/tools';
import { PRICE_SCALE } from '@fastgpt/global/common/bill/constants';
import type { UserModelSchema } from '@fastgpt/global/support/user/type';

// 定义用户集合名称
export const userCollectionName = 'users';

// 定义用户模式
const UserSchema = new Schema({
  username: {
    // 可以是手机/邮箱，新的验证都只用手机
    // 用户名，可以是手机/邮箱，新的验证都只用手机
    type: String,
    required: true,
    unique: true // 唯一
  },
  password: {
    type: String,
    required: true,
    set: (val: string) => hashStr(val),
    get: (val: string) => hashStr(val),
    select: false
  },
  createTime: {
    type: Date,
    default: () => new Date()
  },
  avatar: {
    type: String,
    default: '/icon/human.svg'
  },
  balance: {
    type: Number,
    default: 2 * PRICE_SCALE
  },
  inviterId: {
    // 谁邀请注册的
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  promotionRate: {
    type: Number,
    default: 15
  },
  limit: {
    exportKbTime: {
      // 每半小时
      // Every half hour
      type: Date
    },
    datasetMaxCount: {
      type: Number
    }
  },
  openaiAccount: {
    type: {
      key: String,
      baseUrl: String
    }
  },
  timezone: {
    type: String,
    default: 'Asia/Shanghai'
  }
});

// 定义用户模型
export const MongoUser: Model<UserModelSchema> =
  models[userCollectionName] || model(userCollectionName, UserSchema);
