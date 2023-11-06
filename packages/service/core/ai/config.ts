import type { UserModelSchema } from '@fastgpt/global/support/user/type';
import OpenAI from 'openai';

/**
 * OpenAI基础URL
 */
export const openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

/**
 * 基础URL
 */
export const baseUrl = process.env.ONEAPI_URL || openaiBaseUrl;

/**
 * 系统AI聊天API密钥
 */
export const systemAIChatKey = process.env.CHAT_API_KEY || '';

/**
 * 获取AI API实例
 * @param props - OpenAI账号属性
 * @param timeout - 超时时间
 * @returns AI API实例
 */
export const getAIApi = (props?: UserModelSchema['openaiAccount'], timeout = 6000) => {
  return new OpenAI({
    apiKey: props?.key || systemAIChatKey,
    baseURL: props?.baseUrl || baseUrl,
    httpAgent: global.httpsAgent,
    timeout,
    maxRetries: 2
  });
};
