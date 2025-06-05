import { IconName } from '@grafana/ui';
import { InterpolateFunction } from '@grafana/data';
import { DataLink } from './DataLinksInlineEditor/datalink';

// 角色权限类型
export type RoleType = 'Admin' | 'Editor' | 'Viewer' | string;

export interface LinkProps {
  title: string;
  url: string;
  target?: string;
  color: string;
  options: NavOptions;
  icon: IconName;
  sort?: number;
  roles?: RoleType[]; // 添加角色权限控制
}

export interface NavOptions {
  showLinkIcon: boolean;
  showGroupName: boolean;
  navTitleSize: number; // 改为数字，表示字体大小（px）
  navTheme: string;
  navWidth: number;
  navData: DataLink;
  groupSorting: { [groupName: string]: number };
}

export interface GroupDataProps {
  name: string;
  data: DataLink[];
  options: NavOptions;
  replaceVariables: InterpolateFunction;
  sort?: number;
}
