import React, { FC } from 'react';
import { css, cx } from 'emotion';
import { PanelProps, GrafanaTheme2 } from '@grafana/data';
import { stylesFactory, useTheme2, styleMixins, Icon, HorizontalGroup } from '@grafana/ui';
import { NavOptions, GroupDataProps, LinkProps } from 'types';
// , VerticalGroup

const defaultLinks = [
  { group: 'default', title: 'Grafana Dashboard', url: '/dashboards', targetBlank: false },
  { group: 'default', title: 'Grafana Docs', url: 'https://grafana.com/docs/grafana/latest', targetBlank: true },
  { group: 'default', title: 'Plugin Docs', url: 'https://grafana.com/tutorials/build-a-panel-plugin/', targetBlank: true },
  { group: 'author', title: 'Author: lework', url: 'https://lework.github.io/', targetBlank: true },
  {
    group: 'author',
    title: 'Repo: grafana-lenav-panel',
    url: 'https://github.com/lework/grafana-lenav-panel',
    targetBlank: true,
  },
];

interface Props extends PanelProps<NavOptions> { }

export const NavPanel: FC<Props> = ({ options, data, width, height }) => {
  const styles = GetStyles(options.navTheme)(useTheme2());

  let dataLinks: { [index: string]: any } = {};
  let userLinks = [];

  userLinks = (options['navData'] as any) || defaultLinks;

  userLinks.map((option: { group: string }) => {
    let group = option.group || 'default';

    if (!dataLinks.hasOwnProperty(group)) {
      dataLinks[group] = [];
    }

    dataLinks[group].push(option);
  });

  return (
    <div className={styles.container}>
      {Object.keys(dataLinks).map((key, index) => {
        return <GroupDataLink key={index} name={key} data={dataLinks[key]} options={options} />;
      })}
    </div>
  );
};

export const Link: FC<LinkProps> = ({ title, url, target, color, options, icon }) => {
  const theme = useTheme2();
  const styles = GetStyles(options.navTheme)(theme);

  return (
    <a
      className={cx(
        styles.link,
        css`
          color: ${color};
          font-size: ${theme.typography.size[options.navTitleSize]};
          width: ${options.navWidth}px;
        `
      )}
      href={url}
      target={target}
    >
      {options['showLinkIcon'] && (
        <Icon name={target === '_self' ? 'link' : 'external-link-alt'} className={styles.icon} />
      )}
      <span className={styles.linkName}>{title}</span>
    </a>
  );
};

export const GroupDataLink: FC<GroupDataProps> = ({ name, data, options }) => {
  const styles = GetStyles(options.navTheme)(useTheme2());
  return (
    <div className={styles.group}>
      {options.showGroupName && <div className={styles.groupItem}><span className={styles.groupName}>{name}</span></div>}
      <div className={styles.linkItem}>
        <HorizontalGroup align="flex-start" justify="flex-start" spacing="md" wrap>
          {data.map((option, index) => {
            if (!option.url) {
              return;
            }
            return (
              <Link
                key={index}
                title={option.title}
                icon={option.icon}
                color={option.color}
                url={option.url}
                options={options}
                target={option.targetBlank ? '_blank' : '_self'}
              />
            );
          })}
        </HorizontalGroup >
      </div>
    </div>
  );
};

const getDefaultStyles = stylesFactory((theme: GrafanaTheme2) => {
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
    link: css`
      position: relative;
      display: inline-flex;
      padding: 8px;
      border-radius: 2px;
      overflow: hidden;
      transition: background .1s ease-out;
      line-height: 1.25;
      width: 100px;
      &:hover {
        background: ${styleMixins.hoverColor(theme.v1.colors.bg2, theme)};
      }
    `,
    linkName: css`
      white-space: nowrap;
    `,
    icon: css`
      margin-right: ${theme.spacing(1)};
      align-items: center;
      justify-content: center;
      opacity: .9;
      filter: saturate(80%);
    `,
  };
});

const getBoxStyles = stylesFactory((theme: GrafanaTheme2) => {
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
    link: css`
      background: ${theme.v1.colors.bg2};
      box-shadow: ${theme.v1.shadows.listItem};
      border-radius: ${theme.v1.border.radius.md};
      padding: ${theme.spacing(1)};
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      @media only screen and (max-width: ${theme.breakpoints.values.sm}) {
        margin-right: 8px;
        width: 100px;
      }
      &:hover {
        background: ${styleMixins.hoverColor(theme.v1.colors.bg2, theme)};
      }
    `,
    linkName: css`
      white-space: nowrap;
    `,
    icon: css`
      margin-right: ${theme.spacing(1)};
      align-items: center;
      justify-content: center;
      opacity: .9;
      filter: saturate(80%);
    `,
  };
});

function GetStyles(theme: string) {
  if (theme === 'box') {
    return getBoxStyles;
  }

  return getDefaultStyles;
}
