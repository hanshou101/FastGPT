import type { ChatCompletionRequestMessage } from '@fastgpt/global/core/ai/type.d';
import { getAIApi } from '../config';

/**
 * 提示问题引导语
 */
export const Prompt_QuestionGuide = `我不太清楚问你什么问题，请帮我生成 3 个问题，引导我继续提问。问题的长度应小于20个字符，按 JSON 格式返回: ["问题1", "问题2", "问题3"]`;

/**
 * 创建问题引导
 *
 * 将【问题1】、【问题2】、【问题3】，生成相关，可以提问的问题。
 *
 *
 * @param messages - 聊天请求消息列表
 * @param model - 模型名称
 * @returns 生成的问题引导
 */
export async function createQuestionGuide({
  messages,
  model
}: {
  messages: ChatCompletionRequestMessage[];
  model: string;
}) {
  const ai = getAIApi(undefined, 48000);
  const data = await ai.chat.completions.create({
    model: model,
    temperature: 0,
    max_tokens: 200,
    messages: [
      ...messages,
      {
        role: 'user',
        content: Prompt_QuestionGuide
      }
    ],
    stream: false
  });
  const answer = data.choices?.[0]?.message?.content || '';
  const totalTokens = data.usage?.total_tokens || 0;
  const start = answer.indexOf('[');
  const end = answer.lastIndexOf(']');
  if (start === -1 || end === -1) {
    return {
      result: [],
      tokens: totalTokens
    };
  }
  const jsonStr = answer
    .substring(start, end + 1)
    .replace(/(\\n|\\)/g, '')
    .replace(/  /g, '');

  try {
    return {
      result: JSON.parse(jsonStr),
      tokens: totalTokens
    };
  } catch (error) {
    return {
      result: [],
      tokens: totalTokens
    };
  }
}