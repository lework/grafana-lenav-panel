import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { PanelProps, GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon } from '@grafana/ui';
import { config } from '@grafana/runtime';
import { NavOptions, GroupDataProps, LinkProps } from 'types';
import { useTranslation } from 'react-i18next';
import './i18n'; // 导入i18n配置

// 创建国际化的默认链接函数
const getDefaultLinks = (t: (key: string) => string) => [
  {
    group: 'Default',
    title: t('defaultLinks.grafanaDashboard'),
    url: '/dashboards',
    targetBlank: false,
    sort: 100,
  },
  {
    group: 'Default',
    title: t('defaultLinks.grafanaDocs'),
    url: 'https://grafana.com/docs/grafana/latest',
    targetBlank: true,
    sort: 40,
  },
  {
    group: 'Default',
    title: t('defaultLinks.pluginDocs'),
    url: 'https://grafana.com/tutorials/build-a-panel-plugin/',
    targetBlank: true,
    sort: 60,
  },
  {
    group: 'Author',
    title: t('defaultLinks.author'),
    url: 'https://lework.github.io/',
    targetBlank: true,
    sort: 50,
  },
  {
    group: 'Author',
    title: t('defaultLinks.repo'),
    url: 'https://github.com/lework/grafana-lenav-panel',
    targetBlank: true,
    sort: 40,
  },
];

interface Props extends PanelProps<NavOptions> { }


// 检查当前用户是否有权限访问链接
const hasLinkPermission = (link: any, t: (key: string) => string): boolean => {
  // 如果链接没有设置角色限制，默认所有人可见
  if (!link.roles || link.roles.length === 0) {
    return true;
  }

  try {
    // 通过 config.bootData.user 获取用户信息
    const user = config.bootData?.user;
    if (!user) {
      console.warn(t('errors.noUserInfo'));
      return false;
    }

    const isAdmin = user.isGrafanaAdmin || false;
    const isEditor = user.orgRole === 'Editor' || isAdmin;
    const isViewer = user.orgRole === 'Viewer' || isEditor;

    // 检查用户是否拥有链接要求的角色
    return link.roles.some((role: string) => {
      if (role === 'Admin' && isAdmin) {
        return true;
      }
      if (role === 'Editor' && isEditor) {
        return true;
      }
      if (role === 'Viewer' && isViewer) {
        return true;
      }
      return false;
    });
  } catch (error) {
    console.error(t('errors.permissionCheck'), error);
    return false; // 出错时默认不显示受限链接
  }
};

export const NavPanel: FC<Props> = ({ options, data, width, height, replaceVariables }) => {
  const styles = useStyles2((theme) => GetStyles(options.navTheme, theme));
  const { t } = useTranslation(); // 在组件顶层调用Hook

  let dataLinks: { [index: string]: any } = {};
  let userLinks = [];

  userLinks = (options['navData'] as any) || getDefaultLinks(t);

  // 只处理当前用户有权限访问的链接
  const filteredLinks = userLinks.filter((link: any) => hasLinkPermission(link, t));

  filteredLinks.map((option: { group: string }) => {
    let group = option.group || 'Default';

    if (!dataLinks.hasOwnProperty(group)) {
      dataLinks[group] = [];
    }

    dataLinks[group].push(option);
  });

  // 获取分组的排序值：使用组内最大sort值
  const getGroupSort = (groupName: string, groupData: any[]) => {
    const sortValues = groupData.map(item => item.sort ?? 0);
    return Math.max(...sortValues, 0);
  };

  // 将分组数据转换为数组并排序
  const sortedGroups = Object.keys(dataLinks)
    .map(key => ({
      name: key,
      data: dataLinks[key],
      sort: getGroupSort(key, dataLinks[key])
    }))
    .sort((a, b) => b.sort - a.sort); // 按sort值降序排列，值越大越靠前

  return (
    <div className={styles.container}>
      {sortedGroups.map((group, index) => {
        return (
          <GroupDataLink 
            key={index} 
            name={group.name} 
            data={group.data} 
            options={options} 
            replaceVariables={replaceVariables}
            sort={group.sort}
          />
        );
      })}
    </div>
  );
};

// Helper function to get font size based on size option
const getFontSize = (size: number): string => {
  // 确保字体大小在合理范围内
  const fontSize = Math.max(8, Math.min(32, size || 14));
  return `${fontSize}px`;
};

export const Link: FC<LinkProps> = ({ title, url, target, color, options, icon }) => {
  const styles = useStyles2((theme) => GetStyles(options.navTheme, theme));
  
  // 根据字体大小动态计算图标的垂直偏移
  const fontSize = Math.max(8, Math.min(32, options.navTitleSize || 14));
  const iconOffset = Math.max(0, (16 - fontSize) * 0.15); // 以16px为基准，字体越小偏移越大

  return (
    <a
      className={cx(
        styles.link,
        css`
          color: ${color};
          font-size: ${getFontSize(options.navTitleSize)};
          width: ${options.navWidth}px;
        `
      )}
      href={url}
      target={target}
      title={title}
    >
      {options['showLinkIcon'] && (
        <Icon 
          name={target === '_self' ? 'link' : 'external-link-alt'} 
          className={cx(
            styles.icon,
            css`
              margin-bottom: ${iconOffset}px;
            `
          )}
        />
      )}
      <span className={styles.linkName}>{title}</span>
    </a>
  );
};

export const GroupDataLink: FC<GroupDataProps> = ({ name, data, options, replaceVariables, sort }) => {
  const styles = useStyles2((theme) => GetStyles(options.navTheme, theme));
  
  // 对链接按照 sort 字段进行排序，sort 值越大排在前面
  const sortedData = [...data].sort((a, b) => {
    const sortA = a.sort ?? 0; // 默认值为 0
    const sortB = b.sort ?? 0; // 默认值为 0
    return sortB - sortA; // 降序排列
  });

  return (
    <div className={styles.group}>
      {options.showGroupName && (
        <div className={styles.groupItem}>
          <span className={styles.groupName} title={name}>{name}</span>
        </div>
      )}
      <div className={styles.linkItem}>
        <div className={styles.horizontalGroup}>
          {sortedData.map((option, index) => {
            if (!option.url) {
              return;
            }
            return (
              <Link
                key={index}
                title={option.title}
                icon={option.icon}
                color={option.color}
                url={replaceVariables(option.url)}
                options={options}
                target={option.targetBlank ? '_blank' : '_self'}
                sort={option.sort ?? 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getDefaultStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      box-sizing: border-box;
      background-size: cover;
      overflow: auto;
      height: 100%;
      justify-content: space-between;
      padding: 0 ${theme.spacing(1)};
      margin-right: ${theme.spacing(1)};
      @media only screen and (max-width: ${theme.breakpoints.values.lg}) {
        background-position: 0px;
        flex-direction: column;
        align-items: flex-start;
      }
      @media only screen and (max-width: ${theme.breakpoints.values.sm}) {
        padding: 0 ${theme.spacing(1)};
      }
    `,
    group: css`
      position: relative;
      display: flex;
      margin-bottom: ${theme.spacing(2)};
    `,
    groupItem: css`
      position: relative;
      display: flex;
      max-width: 10%;
      overflow: hidden;
      margin-right: ${theme.spacing(1)};
      color: ${theme.colors.text.secondary};
      font-weight: ${theme.typography.fontWeightMedium};
      font-size: ${theme.typography.h5.fontSize};
      align-items: center;
      flex: 0 0 10%;
    `,
    groupName: css`
      white-space: nowrap;
    `,
    linkItem: css`
      display: flex;
      max-width: 90%;
      overflow: hidden;
      flex: 0 0 90%;
    `,
    horizontalGroup: css`
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: ${theme.spacing(2)};
      width: 100%;
    `,
    link: css`
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px;
      border-radius: 2px;
      overflow: hidden;
      transition: background 0.1s ease-out;
      line-height: 1.25;
      width: 100px;
      &:hover {
        background: ${theme.colors.action.hover};
      }
    `,
    linkName: css`
      white-space: nowrap;
      display: flex;
      align-items: center;
    `,
    icon: css`
      margin-right: ${theme.spacing(1)};
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.9;
      filter: saturate(80%);
    `,
  };
};

const getBoxStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      box-sizing: border-box;
      background-size: cover;
      overflow: auto;
      height: 100%;
      justify-content: space-between;
      padding: 0 ${theme.spacing(1)};
      @media only screen and (max-width: ${theme.breakpoints.values.lg}) {
        background-position: 0px;
        flex-direction: column;
        align-items: flex-start;
      }
      @media only screen and (max-width: ${theme.breakpoints.values.sm}) {
        padding: 0 ${theme.spacing(1)};
      }
    `,
    group: css`
      position: relative;
      display: flex;
      margin-bottom: ${theme.spacing(2)};
    `,
    groupItem: css`
      position: relative;
      display: flex;
      max-width: 10%;
      margin-right: ${theme.spacing(1)};
      overflow: hidden;
      color: ${theme.colors.text.secondary};
      font-weight: ${theme.typography.fontWeightMedium};
      font-size: ${theme.typography.h5.fontSize};
      align-items: center;
      flex: 0 0 10%;
    `,
    groupName: css`
      white-space: nowrap;
    `,
    linkItem: css`
      display: flex;
      max-width: 90%;
      overflow: hidden;
      flex: 0 0 90%;
    `,
    horizontalGroup: css`
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: ${theme.spacing(2)};
      width: 100%;
    `,
    link: css`
      background: ${theme.colors.background.secondary};
      box-shadow: ${theme.shadows.z1};
      border-radius: ${theme.shape.radius.default};
      padding: ${theme.spacing(1)};
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      @media only screen and (max-width: ${theme.breakpoints.values.sm}) {
        margin-right: 8px;
        width: 100px;
      }
      &:hover {
        background: ${theme.colors.action.hover};
      }
    `,
    linkName: css`
      white-space: nowrap;
      display: flex;
      align-items: center;
    `,
    icon: css`
      margin-right: ${theme.spacing(1)};
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.9;
      filter: saturate(80%);
    `,
  };
};

function GetStyles(theme: string, grafanaTheme: GrafanaTheme2) {
  if (theme === 'box') {
    return getBoxStyles(grafanaTheme);
  }

  return getDefaultStyles(grafanaTheme);
}
