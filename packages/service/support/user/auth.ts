import type { NextApiResponse, NextApiRequest } from 'next';
import Cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { authOpenApiKey } from '../openapi/auth';
import { authOutLinkId } from '../outLink/auth';
import { MongoUser } from './schema';
import type { UserModelSchema } from '@fastgpt/global/support/user/type';
import { ERROR_ENUM } from '@fastgpt/global/common/error/errorCode';

/* 
 * 用户身份类型枚举 
 */
export enum AuthUserTypeEnum {
  token = 'token',
  root = 'root',
  apikey = 'apikey',
  outLink = 'outLink'
}

/*
 * auth balance
 * 根据用户ID验证余额 
 */
export const authBalanceByUid = async (uid: string) => {
  const user = await MongoUser.findById<UserModelSchema>(
    uid,
    '_id username balance openaiAccount timezone'
  );
  if (!user) {
    return Promise.reject(ERROR_ENUM.unAuthorization);
  }

  if (user.balance <= 0) {
    return Promise.reject(ERROR_ENUM.insufficientQuota);
  }
  return user;
};

/*
 * uniform auth user
 * 统一验证用户身份 
 */
export const authUser = async ({
  req,
  authToken = false,
  authRoot = false,
  authApiKey = false,
  authBalance = false,
  authOutLink
}: {
  req: NextApiRequest;
  authToken?: boolean;
  authRoot?: boolean;
  authApiKey?: boolean;
  authBalance?: boolean;
  authOutLink?: boolean;
}) => {
  /* 
   * 验证cookie中的token 
   */
  const authCookieToken = async (cookie?: string, token?: string): Promise<string> => {
    // 获取 cookie
    const cookies = Cookie.parse(cookie || '');
    const cookieToken = cookies.token || token;

    if (!cookieToken) {
      return Promise.reject(ERROR_ENUM.unAuthorization);
    }

    return await authJWT(cookieToken);
  };

  /* 
   * 解析authorization获取apikey
   */
  // from authorization get apikey
  const parseAuthorization = async (authorization?: string) => {
    if (!authorization) {
      return Promise.reject(ERROR_ENUM.unAuthorization);
    }

    // Bearer fastgpt-xxxx-appId
    const auth = authorization.split(' ')[1];
    if (!auth) {
      return Promise.reject(ERROR_ENUM.unAuthorization);
    }

    const { apikey, appId: authorizationAppid = '' } = await (async () => {
      const arr = auth.split('-');
      // abandon
      if (arr.length === 3) {
        return {
          apikey: `${arr[0]}-${arr[1]}`,
          appId: arr[2]
        };
      }
      if (arr.length === 2) {
        return {
          apikey: auth
        };
      }
      return Promise.reject(ERROR_ENUM.unAuthorization);
    })();

    // auth apikey
    const { userId, appId: apiKeyAppId = '' } = await authOpenApiKey({ apikey });

    return {
      uid: userId,
      apikey,
      appId: apiKeyAppId || authorizationAppid
    };
  };

  /* 
   * 解析rootKey获取root用户 
   */
  // root user
  const parseRootKey = async (rootKey?: string, userId = '') => {
    if (!rootKey || !process.env.ROOT_KEY || rootKey !== process.env.ROOT_KEY) {
      return Promise.reject(ERROR_ENUM.unAuthorization);
    }
    return userId;
  };

  const { cookie, token, apikey, rootkey, userid, authorization } = (req.headers || {}) as {
    cookie?: string;
    token?: string;
    apikey?: string;
    rootkey?: string; // abandon
    userid?: string;
    authorization?: string;
  };
  const { shareId } = (req?.body || {}) as { shareId?: string };

  let uid = '';
  let appId = '';
  let openApiKey = apikey;
  let authType: `${AuthUserTypeEnum}` = AuthUserTypeEnum.token;

  if (authOutLink && shareId) {
    const res = await authOutLinkId({ id: shareId });
    uid = res.userId;
    authType = AuthUserTypeEnum.outLink;
  } else if (authToken && (cookie || token)) {
    // user token(from fastgpt web)
    uid = await authCookieToken(cookie, token);
    authType = AuthUserTypeEnum.token;
  } else if (authRoot && rootkey) {
    // root user
    uid = await parseRootKey(rootkey, userid);
    authType = AuthUserTypeEnum.root;
  } else if (authApiKey && apikey) {
    // apikey
    const parseResult = await authOpenApiKey({ apikey });
    uid = parseResult.userId;
    authType = AuthUserTypeEnum.apikey;
    openApiKey = parseResult.apikey;
  } else if (authApiKey && authorization) {
    // apikey from authorization
    const authResponse = await parseAuthorization(authorization);
    uid = authResponse.uid;
    appId = authResponse.appId;
    openApiKey = authResponse.apikey;
    authType = AuthUserTypeEnum.apikey;
  }

  // not rootUser and no uid, reject request
  if (!rootkey && !uid) {
    return Promise.reject(ERROR_ENUM.unAuthorization);
  }

  // balance check
  const user = await (() => {
    if (authBalance) {
      return authBalanceByUid(uid);
    }
  })();

  return {
    userId: String(uid),
    appId,
    authType,
    user,
    apikey: openApiKey
  };
};

/* 
 * 生成 token
 */
export function generateToken(userId: string) {
  const key = process.env.TOKEN_KEY as string;
  const token = jwt.sign(
    {
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    },
    key
  );
  return token;
}

/* 
 * 验证token 
 */
// auth token
export function authJWT(token: string) {
  return new Promise<string>((resolve, reject) => {
    const key = process.env.TOKEN_KEY as string;

    jwt.verify(token, key, function (err, decoded: any) {
      if (err || !decoded?.userId) {
        reject(ERROR_ENUM.unAuthorization);
        return;
      }
      resolve(decoded.userId);
    });
  });
}

/* 
 * 设置cookie 
 */
/* set cookie */
export const setCookie = (res: NextApiResponse, token: string) => {
  res.setHeader(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; Max-Age=604800; Samesite=None; Secure;`
  );
};

/* 
 * 清除cookie 
 */
/* clear cookie */
export const clearCookie = (res: NextApiResponse) => {
  res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0');
}; 