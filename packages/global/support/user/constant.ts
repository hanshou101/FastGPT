export enum InformTypeEnum {
  system = 'system' // 系统通知类型
}

/*
 * 通知类型映射对象
 */
export const InformTypeMap = {
  [InformTypeEnum.system]: {
    label: '系统通知' // 系统通知标签
  }
};

export enum TeamMemberRoleEnum {
  owner = 'owner', // 拥有者角色
  admin = 'admin', // 管理员角色
  member = 'member', // 成员角色
  visitor = 'visitor' // 访客角色
}

/*
 * 团队成员角色映射对象
 */
export const TeamMemberRoleMap = {
  [TeamMemberRoleEnum.owner]: {
    label: 'user.team.role.owner' // 拥有者角色标签
  },
  [TeamMemberRoleEnum.admin]: {
    label: 'user.team.role.admin' // 管理员角色标签
  },
  [TeamMemberRoleEnum.member]: {
    label: 'user.team.role.member' // 成员角色标签
  },
  [TeamMemberRoleEnum.visitor]: {
    label: 'user.team.role.visitor' // 访客角色标签
  }
};
