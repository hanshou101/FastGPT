import { CreateOnePluginParams, UpdatePluginParams } from '@fastgpt/global/core/plugin/controller';
import { MongoPlugin } from './schema';
import { FlowModuleTemplateType } from '@fastgpt/global/core/module/type';
import { FlowNodeTypeEnum } from '@fastgpt/global/core/module/node/constant';
import { formatPluginIOModules } from '@fastgpt/global/core/module/utils';

/**
 * 创建插件
 * @param data - 创建插件参数及用户ID
 * @returns 插件ID
 */
export async function createOnePlugin(data: CreateOnePluginParams & { userId: string }) {
  const { _id } = await MongoPlugin.create(data);
  return _id;
}

/**
 * 更新插件
 * @param id - 插件ID
 * @param userId - 用户ID
 * @param data - 更新数据
 */
export async function updateOnePlugin({
  id,
  userId,
  ...data
}: UpdatePluginParams & { userId: string }) {
  await MongoPlugin.findOneAndUpdate({ _id: id, userId }, data);
}

/**
 * 删除插件
 * @param id - 插件ID
 * @param userId - 用户ID
 */
export async function deleteOnePlugin({ id, userId }: { id: string; userId: string }) {
  await MongoPlugin.findOneAndDelete({ _id: id, userId });
}

/**
 * 获取用户的插件列表
 * @param userId - 用户ID
 * @returns 插件列表
 */
export async function getUserPlugins({ userId }: { userId: string }) {
  return MongoPlugin.find({ userId }, 'name avatar intro');
}

/**
 * 获取插件的详细信息
 * @param id - 插件ID
 * @param userId - 用户ID
 * @returns 插件详细信息
 */
export async function getOnePluginDetail({ id, userId }: { userId: string; id: string }) {
  return MongoPlugin.findOne({ _id: id, userId });
}

/* plugin templates */

/**
 * 获取用户的插件转换为模板的列表
 * @param userId - 用户ID
 * @returns 模板列表
 */
export async function getUserPlugins2Templates({
  userId
}: {
  userId: string;
}): Promise<FlowModuleTemplateType[]> {
  const plugins = await MongoPlugin.find({ userId }).lean();

  return plugins.map((plugin) => ({
    id: String(plugin._id),
    flowType: FlowNodeTypeEnum.pluginModule,
    logo: plugin.avatar,
    name: plugin.name,
    description: plugin.intro,
    intro: plugin.intro,
    showStatus: false,
    inputs: [],
    outputs: []
  }));
}

/**
 * 获取插件转换为模块的详细信息
 * @param id - 插件ID
 * @param userId - 用户ID
 * @returns 模块详细信息
 */
export async function getPluginModuleDetail({ id, userId }: { userId: string; id: string }) {
  const plugin = await getOnePluginDetail({ id, userId });
  if (!plugin) return Promise.reject('plugin not found');
  return {
    id: String(plugin._id),
    flowType: FlowNodeTypeEnum.pluginModule,
    logo: plugin.avatar,
    name: plugin.name,
    description: plugin.intro,
    intro: plugin.intro,
    showStatus: false,
    ...formatPluginIOModules(String(plugin._id), plugin.modules)
  };
}
