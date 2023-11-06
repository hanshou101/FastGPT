import { connectionMongo, type Model } from '../../../common/mongo';

// 引入必要的模块
const { Schema, model, models } = connectionMongo;
import { PaySchema as PayType } from '@fastgpt/global/support/wallet/type.d';

// 定义支付模式
const PaySchema = new Schema({
  userId: {
    // 用户ID
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createTime: {
    // 创建时间
    type: Date,
    default: () => new Date()
  },
  price: {
    // 价格
    type: Number,
    required: true
  },
  orderId: {
    // 订单ID
    type: String,
    required: true
  },
  status: {
    // 支付的状态
    type: String,
    default: 'NOTPAY',
    enum: ['SUCCESS', 'REFUND', 'NOTPAY', 'CLOSED']
  }
});

// 定义支付模型
export const MongoPay: Model<PayType> = models['pay'] || model('pay', PaySchema);
