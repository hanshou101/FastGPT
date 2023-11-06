/* 
 * 这段代码是用于定义 MongoDB 图片模型的模块。 
 * 包含了定义图片模型的 Schema 和创建模型的逻辑。 
 */

import { connectionMongo, type Model } from '../../mongo';

// 导入 MongoDB 连接、模型和模式 
const { Schema, model, models } = connectionMongo;

// 定义图片模型的 Schema 
const ImageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  binary: {
    type: Buffer
  }
});

// 导出 MongoDB 图片模型 
export const MongoImage: Model<{ userId: string; binary: Buffer }> =
  models['image'] || model('image', ImageSchema);
