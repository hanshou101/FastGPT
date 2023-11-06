/* 
 * 这段代码是一个用于添加跨域支持的 Next.js API 中间件。 
 * 使用了 nextjs-cors 库来处理跨域请求。 
 */

// 导入 Next.js API 所需的类型和 nextjs-cors 库 
import type { NextApiResponse, NextApiHandler, NextApiRequest } from 'next';
import NextCors from 'nextjs-cors';

/**
 * 添加跨域支持的 Next.js API 中间件
 * @param handler - 原始的 Next.js API 处理函数
 * @returns 添加跨域支持后的 Next.js API 处理函数
 */
export function withNextCors(handler: NextApiHandler): NextApiHandler {
  return async function nextApiHandlerWrappedWithNextCors(
      req: NextApiRequest,
      res: NextApiResponse
  ) {
    const methods = ['GET', 'eHEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
    const origin = req.headers.origin;

    // 调用 NextCors 函数处理跨域请求 
    await NextCors(req, res, {
      methods,
      origin: origin,
      optionsSuccessStatus: 200
    });

    // 调用原始的 Next.js API 处理函数 
    return handler(req, res);
  };
}