import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoOutLink } from '@fastgpt/service/support/outLink/schema';
import { MongoUser } from '@fastgpt/service/support/user/schema';
import type { InitShareChatResponse } from '@/global/support/api/outLinkRes.d';
import { authApp } from '@/service/utils/auth';
import { HUMAN_ICON } from '@/constants/chat';
import { getGuideModule } from '@/global/core/app/modules/utils';
import { authShareChatInit } from '@fastgpt/service/support/outLink/auth';
import { getChatModelNameListByModules } from '@/service/core/app/module';

/* init share chat window */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    let { shareId, authToken } = req.query as {
      shareId: string;
      authToken?: string;
    };

    if (!shareId) {
      throw new Error('params is error');
    }

    // get shareChat
    const shareChat = await MongoOutLink.findOne({ shareId });

    if (!shareChat) {
      return jsonRes(res, {
        code: 501,
        error: '分享链接已失效'
      });
    }

    // 校验使用权限
    const [{ app }, user] = await Promise.all([
      authApp({
        appId: shareChat.appId,
        userId: String(shareChat.userId),
        authOwner: false
      }),
      MongoUser.findById(shareChat.userId, 'avatar'),
      authShareChatInit({
        authToken,
        tokenUrl: shareChat.limit?.hookUrl
      })
    ]);

    jsonRes<InitShareChatResponse>(res, {
      data: {
        userAvatar: user?.avatar || HUMAN_ICON,
        app: {
          userGuideModule: getGuideModule(app.modules),
          chatModels: getChatModelNameListByModules(app.modules),
          name: app.name,
          avatar: app.avatar,
          intro: app.intro
        }
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
