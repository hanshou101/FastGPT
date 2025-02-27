import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, App } from '@/service/mongo';
import { authUser } from '@fastgpt/service/support/user/auth';
import { AppListItemType } from '@/types/app';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    // 凭证校验
    const { userId } = await authUser({ req, authToken: true });

    // 根据 userId 获取模型信息
    const myApps = await App.find(
      {
        userId
      },
      '_id avatar name intro'
    ).sort({
      updateTime: -1
    });

    jsonRes<AppListItemType[]>(res, {
      data: myApps
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
