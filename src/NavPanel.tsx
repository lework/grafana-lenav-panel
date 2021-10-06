import React, { FC } from 'react';
import { css, cx } from 'emotion';
import { PanelProps, GrafanaTheme2 } from '@grafana/data';
import { stylesFactory, useTheme2, styleMixins, Icon, HorizontalGroup, VerticalGroup } from '@grafana/ui';

import { NavOptions, GroupDataProps, LinkProps } from 'types';

const defaultLinks = [
  { group: 'default', title: '请配置一个链接', url: 'https://grafana.com/docs/grafana/latest', targetBlank: true },
  { group: 'author', title: 'author: lework', url: 'https://lework.github.io/', targetBlank: true },
  {
    group: 'author',
    title: 'repo: grafana-lenav-panel',
    url: 'https://github.com/lework/grafana-lenav-panel',
    targetBlank: true,
  },
];

interface Props extends PanelProps<NavOptions> {}

export const NavPanel: FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles(options.navTheme);

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
        return <GroupDataLink name={key} data={dataLinks[key]} options={options} />;
      })}
    </div>
  );
};

export const Link: FC<LinkProps> = ({ title, url, target, color, options, icon }) => {
  const theme = useTheme2();
  const styles = getStyles(options.navTheme);

  return (
    <a
      className={cx(
        styles.item,
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
      <span>{title}</span>
    </a>
  );
};

export const GroupDataLink: FC<GroupDataProps> = ({ name, data, options }) => {
  const styles = getStyles(options.navTheme);
  return (
    <div className={styles.group}>
      <VerticalGroup spacing="xs">
        {options.showGroupName && <div className={styles.groupName}>[{name}]</div>}
        <HorizontalGroup align="flex-start" justify="flex-start" spacing="md" wrap>
          {data.map((option) => {
            if (!option.url) {
              return;
            }
            return (
              <Link
                title={option.title}
                icon={option.icon}
                color={option.color}
                url={option.url}
                options={options}
                target={option.targetBlank ? '_blank' : '_self'}
              />
            );
          })}
        </HorizontalGroup>
      </VerticalGroup>
    </div>
  );
};

const getDefaultStyles = stylesFactory((theme: GrafanaTheme2) => {
  return {
    container: css`
      background-size: cover;
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
      margin-bottom: ${theme.spacing(2)};
    `,
    groupName: css`
      font-weight: ${theme.typography.fontWeightBold};
      font-size: ${theme.typography.h4.fontSize};
      margin-bottom: 1px solid ${theme.spacing(2)};
      color: orange;
    `,
    item: css`
      width: 160px;
      margin-right: ${theme.spacing(3)};
      text-decoration: underline;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      @media only screen and (max-width: ${theme.breakpoints.values.sm}) {
        margin-right: 8px;
        width: 100px;
      }
    `,
    icon: css`
      margin-right: ${theme.spacing(1)};
      align-items: center;
      justify-content: center;
    `,
  };
});

const getBoxStyles = stylesFactory((theme: GrafanaTheme2) => {
  return {
    container: css`
      background-size: cover;
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
      margin-bottom: ${theme.spacing(2)};
    `,
    groupName: css`
      font-weight: ${theme.typography.fontWeightBold};
      font-size: ${theme.typography.h4.fontSize};
      margin-bottom: 1px solid ${theme.spacing(2)};
      color: orange;
    `,
    item: css`
      background: ${theme.v1.colors.bg2};
      &:hover {
        background: ${styleMixins.hoverColor(theme.v1.colors.bg2, theme)};
      }
      box-shadow: ${theme.v1.shadows.listItem};
      border-radius: ${theme.v1.border.radius.md};

      padding: ${theme.spacing(1)};
      margin-right: ${theme.spacing(2)};
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      @media only screen and (max-width: ${theme.breakpoints.values.sm}) {
        margin-right: 8px;
        width: 100px;
      }
    `,
    icon: css`
      margin-right: ${theme.spacing(1)};
      align-items: center;
      justify-content: center;
    `,
  };
});

function getStyles(theme: string) {
  if (theme == 'box') {
    return getBoxStyles(useTheme2());
  }

  return getDefaultStyles(useTheme2());
}
