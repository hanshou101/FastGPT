import { ModuleItemType } from '../module/type';

/**
 * 【流程节点】的【Plugin插件】，默认模块数组
 */
export const defaultModules: ModuleItemType[] = [
  {
    moduleId: 'fph4s3',
    name: '自定义输出',
    flowType: 'pluginOutput',
    showStatus: false,
    /**
     * 记录绘图位置
     */
    position: {
      x: 994.1266684738011,
      y: -45.87689365278443
    },
    inputs: [],
    outputs: []
  },
  {
    moduleId: 'w09v30',
    name: '自定义输入',
    flowType: 'pluginInput',
    showStatus: false,
    /**
     * 记录绘图位置
     */
    position: {
      x: 457.57860319995154,
      y: -44.25099042468186
    },
    inputs: [],
    outputs: []
  }
];
