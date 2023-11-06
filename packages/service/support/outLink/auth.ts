/*  
 * 导入所需模块和函数 
 */
import { AuthUserTypeEnum, authBalanceByUid } from '../user/auth';
import { MongoOutLink } from './schema';
import { POST } from '../../common/api/plusRequest';
import { OutLinkSchema } from '@fastgpt/global/support/outLink/type';

/* 
 * 定义类型和属性 
 */
export type AuthLinkProps = { ip?: string | null; authToken?: string; question: string };
export type AuthLinkLimitProps = AuthLinkProps & { outLink: OutLinkSchema };

/* 
 * 异步函数，用于验证外部链接聊天权限 
 */
export async function authOutLinkChat({
  shareId,
  ip,
  authToken,
  question
}: AuthLinkProps & {
  shareId: string;
}) {
  // 获取外部链接信息
  // get outLink
  const outLink = await MongoOutLink.findOne({
    shareId
  });

  if (!outLink) {
    return Promise.reject('分享链接无效');
  }

  const uid = String(outLink.userId);

  const [user] = await Promise.all([
    authBalanceByUid(uid), // 验证用户余额    // authBalance
    ...(global.feConfigs?.isPlus ? [authOutLinkLimit({ outLink, ip, authToken, question })] : []) // 验证限制权限    // limit auth
  ]);

  return {
    user,
    userId: String(outLink.userId),
    appId: String(outLink.appId),
    authType: AuthUserTypeEnum.token,
    responseDetail: outLink.responseDetail
  };
}

/* 
 * 函数，用于验证外部链接聊天限制 
 */
export function authOutLinkLimit(data: AuthLinkLimitProps) {
  return POST('/support/outLink/authLimit', data);
}

/* 
 * 异步函数，用于验证外部链接ID 
 */
export async function authOutLinkId({ id }: { id: string }) {
  const outLink = await MongoOutLink.findOne({
    shareId: id
  });

  if (!outLink) {
    return Promise.reject('分享链接无效');
  }

  return {
    userId: String(outLink.userId)
  };
}

/* 
 * 定义类型，用于初始化分享聊天权限 
 */
export type AuthShareChatInitProps = {
  authToken?: string;
  tokenUrl?: string;
};

/* 
 * 函数，用于初始化分享聊天权限 
 */
export function authShareChatInit(data: AuthShareChatInitProps) {
  if (!global.feConfigs?.isPlus) return;
  return POST('/support/outLink/authShareChatInit', data);
}
