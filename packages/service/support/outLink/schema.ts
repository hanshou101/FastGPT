/*  
 * 导入所需模块和函数 
 */
import { connectionMongo, type Model } from '../../common/mongo';
const { Schema, model, models } = connectionMongo;
import { OutLinkSchema as SchemaType } from '@fastgpt/global/support/outLink/type';
import { OutLinkTypeEnum } from '@fastgpt/global/support/outLink/constant';

/* 
 * 定义外部链接模式 
 */
const OutLinkSchema = new Schema({
  shareId: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  appId: {
    type: Schema.Types.ObjectId,
    ref: 'model',
    required: true
  },
  type: {
    type: String,
    default: OutLinkTypeEnum.share
  },
  name: {
    type: String,
    required: true
  },
  total: {
    // 总数
    // total amount
    type: Number,
    default: 0
  },
  lastTime: {
    type: Date
  },
  responseDetail: {
    type: Boolean,
    default: false
  },
  limit: {
    expiredTime: {
      type: Date
    },
    QPM: {
      type: Number,
      default: 1000
    },
    credit: {
      type: Number,
      default: -1
    },
    hookUrl: {
      type: String
    }
  }
});

/* 
 * 导出外部链接模型 
 */
export const MongoOutLink: Model<SchemaType> =
  models['outlinks'] || model('outlinks', OutLinkSchema);
