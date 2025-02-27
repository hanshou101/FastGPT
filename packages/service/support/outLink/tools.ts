import axios from 'axios';
import { MongoOutLink } from './schema';

// 更新外部链接使用情况
export const updateOutLinkUsage = async ({
  shareId,
  total
}: {
  shareId: string;
  total: number;
}) => {
  try {
    await MongoOutLink.findOneAndUpdate(
      { shareId },
      {
        $inc: { total },
        lastTime: new Date()
      }
    );
  } catch (err) {
    console.log('update shareChat error', err);
  }
};

/**
 * 将结果推送到远程
 * 进行【分享、统计】等等
 *
 * @param authToken
 * @param shareId
 * @param responseData
 */
export const pushResult2Remote = async ({
  authToken,
  shareId,
  responseData
}: {
  authToken?: string;
  shareId?: string;
  responseData?: any[];
}) => {
  if (!shareId || !authToken) return;
  try {
    const outLink = await MongoOutLink.findOne({
      shareId
    });
    if (!outLink?.limit?.hookUrl) return;

    axios({
      method: 'post',
      baseURL: outLink.limit.hookUrl,
      url: '/shareAuth/finish',
      data: {
        token: authToken,
        responseData
      }
    });
  } catch (error) {}
};
