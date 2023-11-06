/**
 * 流程节点输入类型
 */
export enum FlowNodeInputTypeEnum {
  systemInput = 'systemInput', // history, userChatInput, variableInput 系统输入，可以是历史记录、用户聊天输入、变量输入
  input = 'input', // one line input 单行输入
  textarea = 'textarea', // 多行文本输入
  numberInput = 'numberInput', // 数字输入
  select = 'select', // 下拉选择
  slider = 'slider', // 滑块选择
  custom = 'custom', // 自定义输入
  target = 'target', // data input 数据输入
  switch = 'switch', // 开关
  chatInput = 'chatInput', // 聊天输入
  selectApp = 'selectApp', // 选择应用
  // chat special input
  aiSettings = 'aiSettings', // 聊天特殊输入，AI设置
  maxToken = 'maxToken', // 聊天特殊输入，最大token数
  selectChatModel = 'selectChatModel', // 聊天特殊输入，选择聊天模型
  // dataset special input
  selectDataset = 'selectDataset', // 数据集特殊输入，选择数据集
  hidden = 'hidden' // 隐藏输入
}

/**
 * 流程节点输出类型
 */
export enum FlowNodeOutputTypeEnum {
  answer = 'answer', // 回答
  source = 'source', // 数据来源
  hidden = 'hidden' // 隐藏输出
}

/**
 * 流程节点类型
 */
export enum FlowNodeTypeEnum {
  empty = 'empty', // 空节点
  variable = 'variable', // 变量节点
  userGuide = 'userGuide', // 用户指南节点
  questionInput = 'questionInput', // 问题输入节点
  historyNode = 'historyNode', // 历史记录节点
  chatNode = 'chatNode', // 聊天节点
  datasetSearchNode = 'datasetSearchNode', // 数据集搜索节点
  answerNode = 'answerNode', // 回答节点
  classifyQuestion = 'classifyQuestion', // 问题分类节点
  contentExtract = 'contentExtract', // 内容提取节点
  httpRequest= 'httpRequest',// HTTP请求节点
  runApp = 'app', // 运行应用节点
  pluginModule = 'pluginModule', // 插件模块节点
  pluginInput = 'pluginInput', // 插件输入节点
  pluginOutput = 'pluginOutput' // 插件输出节点
}

/**
 * 流程节点特殊输入键
 */
export enum FlowNodeSpecialInputKeyEnum {
  'answerText' = 'text', // 回答文本
  'agents' = 'agents', // cq agent key CQ代理键
  'pluginId' = 'pluginId' // 插件ID
}

/**
 * 流程节点值类型
 */
export enum FlowNodeValTypeEnum {
  'string' = 'string', // 字符串
  'number' = 'number', // 数字
  'boolean' = 'boolean', // 布尔值
  'chatHistory' = 'chatHistory', // 聊天历史
  'datasetQuote' = 'datasetQuote', // 数据集引用
  'any' = 'any' // 任意类型
}