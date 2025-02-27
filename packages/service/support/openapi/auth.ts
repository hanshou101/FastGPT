import { ERROR_ENUM } from '@fastgpt/global/common/error/errorCode';
import { updateApiKeyUsedTime } from './tools';
import { MongoOpenApi } from './schema';
import { POST } from '../../common/api/plusRequest';
import type { OpenApiSchema } from '@fastgpt/global/support/openapi/type';

/**
 * 认证OpenAPI密钥
 * @param apikey - OpenAPI密钥
 * @returns 认证结果
 */
export type AuthOpenApiLimitProps = { openApi: OpenApiSchema };

export async function authOpenApiKey({ apikey }: { apikey: string }) {
  if (!apikey) {
    return Promise.reject(ERROR_ENUM.unAuthApiKey);
  }

  try {
    const openApi = await MongoOpenApi.findOne({ apiKey: apikey });
    if (!openApi) {
      return Promise.reject(ERROR_ENUM.unAuthApiKey);
    }
    const userId = String(openApi.userId);
    // 认证限制

    // auth limit
    if (global.feConfigs?.isPlus) {
      await POST('/support/openapi/authLimit', { openApi } as AuthOpenApiLimitProps);
    }

    updateApiKeyUsedTime(openApi._id);

    return { apikey, userId, appId: openApi.appId };
  } catch (error) {
    return Promise.reject(error);
  }
}
