

import { IconName } from '@grafana/ui';
import { DataLink } from './DataLinksInlineEditor/datalink';

type FontSize = 'sm' | 'md' | 'lg';

export interface LinkProps {
  title: string;
  url: string;
  target?: string;
  color: string;
  options: NavOptions;
  icon: IconName;
}


export interface NavOptions {
  showLinkIcon: boolean;
  showGroupName: boolean;
  navTitleSize: FontSize;
  navTheme: string;
  navWidth: number;
  navData: DataLink;
}


export interface GroupDataProps {
  name: string;
  data: Array<DataLink>;
  options: NavOptions;
}