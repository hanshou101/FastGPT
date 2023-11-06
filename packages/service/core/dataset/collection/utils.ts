import { MongoDatasetCollection } from './schema';
import { ParentTreePathItemType } from '@fastgpt/global/common/parentFolder/type';

/**
 * 根据顶级集合ID获取所有集合及其子集合
 * @param id - 顶级集合ID
 * @param fields - 返回的字段
 * @returns 所有集合及其子集合的数组
 */
export async function findCollectionAndChild(id: string, fields = '_id parentId name metadata') {
  async function find(id: string) {
    // 查找子集合
    // find children
    const children = await MongoDatasetCollection.find({ parentId: id }, fields);

    let collections = children;

    for (const child of children) {
      const grandChildrenIds = await find(child._id);
      collections = collections.concat(grandChildrenIds);
    }

    return collections;
  }

  const [collection, childCollections] = await Promise.all([
    MongoDatasetCollection.findById(id, fields),
    find(id)
  ]);

  if (!collection) {
    return Promise.reject('Collection not found');
  }

  return [collection, ...childCollections];
}

/**
 * 获取数据集集合路径
 * @param parentId - 父级ID
 * @param userId - 用户ID
 * @returns 数据集集合路径数组
 */
export async function getDatasetCollectionPaths({
  parentId = '',
  userId
}: {
  parentId?: string;
  userId: string;
}): Promise<ParentTreePathItemType[]> {
  async function find(parentId?: string): Promise<ParentTreePathItemType[]> {
    if (!parentId) {
      return [];
    }
    const parent = await MongoDatasetCollection.findOne({ _id: parentId, userId }, 'name parentId');
    if (!parent) return [];
    const paths = await find(parent.parentId);
    paths.push({ parentId, parentName: parent.name });
    return paths;
  }

  return await find(parentId);
}

/**
 * 获取集合更新时间
 * @param name - 集合名称
 * @param time - 更新时间
 * @returns 更新时间
 */
export function getCollectionUpdateTime({ name, time }: { time?: Date; name: string }) {
  if (time) return time;
  if (name.startsWith('手动') || ['manual', 'mark'].includes(name)) return new Date('2999/9/9');
  return new Date();
}