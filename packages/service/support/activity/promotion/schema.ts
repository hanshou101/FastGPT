import { connectionMongo, type Model } from '../../../common/mongo';
const { Schema, model, models } = connectionMongo;
import { PromotionRecordSchema as PromotionRecordType } from '@fastgpt/global/support/activity/type.d';

/**
 * 推广记录模式
 */
const PromotionRecordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  objUId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false
  },
  createTime: {
    type: Date,
    default: () => new Date()
  },
  type: {
    type: String,
    required: true,
    enum: ['pay', 'register']
  },
  amount: {
    type: Number,
    required: true
  }
});

/**
 * MongoDB推广记录模型
 */
export const MongoPromotionRecord: Model<PromotionRecordType> =
  models['promotionRecord'] || model('promotionRecord', PromotionRecordSchema);
