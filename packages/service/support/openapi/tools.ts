import { MongoOpenApi } from './schema';

/*
 * 更新API密钥的最新使用时间
 * 参数：id - API密钥的ID
 */
export async function updateApiKeyUsedTime(id: string) {
  await MongoOpenApi.findByIdAndUpdate(id, {
    lastUsedTime: new Date()
  });
}

/*
 * 更新API密钥的使用次数情况
 * 参数：apikey - API密钥
 *      usage - 使用次数
 */
export async function updateApiKeyUsage({ apikey, usage }: { apikey: string; usage: number }) {
  await MongoOpenApi.findOneAndUpdate(
    { apiKey: apikey },
    {
      $inc: {
        usage
      }
    }
  );
}
