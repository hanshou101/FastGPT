/* 
 * 这段代码是一个用于处理 MongoDB 图片相关操作的模块。 
 * 包含了获取图片 URL、上传图片和读取图片的函数。 
 */

import { imageBaseUrl } from './constant';
import { MongoImage } from './schema';

/**
 * 获取 MongoDB 图片的 URL
 * @param id - 图片 ID
 * @returns 图片的 URL
 */
export function getMongoImgUrl(id: string) {
  return `${imageBaseUrl}${id}`;
}

/**
 * 上传 MongoDB 图片
 * @param base64Img - 图片的 Base64 数据
 * @param userId - 用户 ID
 * @returns 上传后的图片 URL
 */
export async function uploadMongoImg({ base64Img, userId }: { base64Img: string; userId: string }) {
  const base64Data = base64Img.split(',')[1];

  const { _id } = await MongoImage.create({
    userId,
    binary: Buffer.from(base64Data, 'base64')
  });

  return getMongoImgUrl(String(_id));
}

/**
 * 读取 MongoDB 图片
 * @param id - 图片 ID
 * @returns 图片的二进制数据
 */
export async function readMongoImg({ id }: { id: string }) {
  const data = await MongoImage.findById(id);
  if (!data) {
    return Promise.reject('Image not found');
  }
  return data?.binary;
}