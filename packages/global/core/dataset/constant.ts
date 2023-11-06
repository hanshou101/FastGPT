export enum DatasetTypeEnum {
  folder = 'folder',
  dataset = 'dataset'
}

/*
 * 数据集类型枚举
 * 包含两种类型：folder（文件夹）、dataset（数据集）
 */
export const DatasetTypeMap = {
  [DatasetTypeEnum.folder]: {
    name: 'folder'
  },
  [DatasetTypeEnum.dataset]: {
    name: 'dataset'
  }
};

export enum DatasetCollectionTypeEnum {
  file = 'file',
  folder = 'folder',
  link = 'link',
  virtual = 'virtual'
}

/*
 * 数据集集合类型枚举
 * 包含四种类型：file（文件）、folder（文件夹）、link（链接）、virtual（虚拟文件）
 */
export const DatasetCollectionTypeMap = {
  [DatasetCollectionTypeEnum.file]: {
    name: 'dataset.file'
  },
  [DatasetCollectionTypeEnum.folder]: {
    name: 'dataset.folder'
  },
  [DatasetCollectionTypeEnum.link]: {
    name: 'dataset.link'
  },
  [DatasetCollectionTypeEnum.virtual]: {
    name: 'dataset.Virtual File'
  }
};

export enum TrainingModeEnum {
  'qa' = 'qa',
  'index' = 'index'
}

/*
 * 训练模式枚举
 * 包含两种模式：qa、index
 */
export const TrainingTypeMap = {
  [TrainingModeEnum.qa]: 'qa',
  [TrainingModeEnum.index]: 'index'
};

export enum DatasetSpecialIdEnum {
  manual = 'manual',
  mark = 'mark'
}

/*
 * 数据集特殊ID枚举
 * 包含两种特殊ID：manual（手动数据）、mark（标记数据）
 */
export const datasetSpecialIdMap = {
  [DatasetSpecialIdEnum.manual]: {
    name: 'kb.Manual Data',
    sourceName: 'kb.Manual Input'
  },
  [DatasetSpecialIdEnum.mark]: {
    name: 'kb.Mark Data',
    sourceName: 'kb.Manual Mark'
  }
};

/*
 * 数据集特殊ID列表
 * 包含两个特殊ID：manual、mark
 */
export const datasetSpecialIds: string[] = [DatasetSpecialIdEnum.manual, DatasetSpecialIdEnum.mark];

/*
 * 文件夹头像路径
 */
export const FolderAvatarSrc = '/imgs/files/folder.svg';
