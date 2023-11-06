import {
    FlowNodeInputTypeEnum, // 流程节点输入类型枚举
    FlowNodeSpecialInputKeyEnum, // 流程节点特殊输入键枚举
    FlowNodeTypeEnum // 流程节点类型枚举
} from './node/constant'; // 导入节点常量
import { FlowNodeInputItemType, FlowNodeOutputItemType } from './node/type'; // 导入节点类型
import { ModuleItemType } from './type'; // 导入模块类型

/**
 * 获取插件模板的插件ID输入
 * @param pluginId 插件ID
 * @returns 插件ID输入对象
 */
export function getPluginTemplatePluginIdInput(pluginId: string) {
  return {
    key: FlowNodeSpecialInputKeyEnum.pluginId,
    type: FlowNodeInputTypeEnum.hidden,
    label: 'pluginId',
    value: pluginId,
    connected: true
  };
}

/**
 * 格式化插件模块的输入输出
 * @param pluginId 插件ID
 * @param modules 模块类型数组
 * @returns 格式化后的输入输出对象
 */
export function formatPluginIOModules(
  pluginId: string,
  modules: ModuleItemType[]
): {
  inputs: FlowNodeInputItemType[];
  outputs: FlowNodeOutputItemType[];
} {
  const pluginInput = modules.find((module) => module.flowType === FlowNodeTypeEnum.pluginInput);
  const customOutput = modules.find((module) => module.flowType === FlowNodeTypeEnum.pluginOutput);

  return {
    inputs: pluginInput
      ? [
          getPluginTemplatePluginIdInput(pluginId),
          ...pluginInput.inputs.map((item) => ({
            ...item,
            edit: false,
            connected: false
          }))
        ]
      : [],
    outputs: customOutput
      ? customOutput.outputs.map((item) => ({
          ...item,
          edit: false
        }))
      : []
  };
}
