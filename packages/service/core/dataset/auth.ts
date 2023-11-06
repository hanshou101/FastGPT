/*  
 * 导入错误枚举 
 */
import { ERROR_ENUM } from '@fastgpt/global/common/error/errorCode';

/*  
 * 导入Mongo数据集集合模型 
 */
import { MongoDatasetCollection } from './collection/schema';

/*  
 * 导入数据集模式类型 
 */
import { DatasetSchemaType } from '@fastgpt/global/core/dataset/type';

/**
 * 鉴权数据集集合
 * @param {string} collectionId - 集合ID
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回包含鉴权结果的Promise
 */
export async function authCollection({
  collectionId,
  userId
}: {
  collectionId: string;
  userId: string;
}) {
  /*  
   * 查询指定ID和用户ID的数据集集合 
   */
  const collection = await MongoDatasetCollection.findOne({
    _id: collectionId,
    userId
  })
    .populate('datasetId')
    .lean();

  /*  
   * 如果找到了数据集集合 
   */
  if (collection) {
    return {
      ...collection,
      dataset: collection.datasetId as unknown as DatasetSchemaType
    };
  }

  /*  
   * 如果未找到数据集集合，则返回未授权数据集错误 
   */
  return Promise.reject(ERROR_ENUM.unAuthDataset);
}
