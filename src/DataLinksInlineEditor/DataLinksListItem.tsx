import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { useStyles2, IconButton } from '@grafana/ui';
import { DataLink } from './datalink';
import { useTranslation } from 'react-i18next';

export interface DataLinksListItemProps {
  index: number;
  link: DataLink;
  data: DataFrame[];
  onChange: (index: number, link: DataLink) => void;
  onEdit: () => void;
  onRemove: () => void;
  isEditing?: boolean;
}

export const DataLinksListItem: FC<DataLinksListItemProps> = ({ link, onEdit, onRemove }) => {
  const { t } = useTranslation();
  const styles = useStyles2(getDataLinkListItemStyles);
  const { title = '', url = '', group = '', color = '', sort = 0 } = link;

  const hasTitle = title.trim() !== '';
  const hasUrl = url.trim() !== '';
  const hasGroup = group.trim() !== '';
  const hasColor = color.trim() !== '';

  return (
    <div className={styles.wrapper}>
      <div className={styles.verticalGroup}>
        <div className={styles.horizontalGroup}>
          <div
            className={cx(
              styles.title,
              !hasTitle && styles.notConfigured,
              hasColor &&
                css`
                  color: ${color};
                `
            )}
          >
            {hasGroup && `[${group}] `}
            {sort !== 0 && `(${sort}) `}
            {hasTitle ? title : t('linkEditor.defaultTitleText')}
          </div>
          <div className={styles.buttonGroup}>
            <IconButton name="pen" onClick={onEdit} aria-label={t('linkEditor.editDataLinkAria')} />
            <IconButton name="times" onClick={onRemove} aria-label={t('linkEditor.deleteDataLinkAria')} />
          </div>
        </div>
        <div className={cx(styles.url, !hasUrl && styles.notConfigured)} title={url}>
          {hasUrl ? url : t('linkEditor.defaultUrlText')}
        </div>
      </div>
    </div>
  );
};

const getDataLinkListItemStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      margin-bottom: ${theme.spacing(2)};
      width: 100%;
      &:last-child {
        margin-bottom: 0;
      }
    `,
    verticalGroup: css`
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing(1)};
    `,
    horizontalGroup: css`
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    `,
    buttonGroup: css`
      display: flex;
      gap: ${theme.spacing(1)};
    `,
    notConfigured: css`
      font-style: italic;
    `,
    title: css`
      color: ${theme.colors.text.primary};
      font-size: ${theme.typography.bodySmall.fontSize};
      font-weight: ${theme.typography.fontWeightMedium};
    `,
    url: css`
      color: ${theme.colors.text.secondary};
      font-size: ${theme.typography.bodySmall.fontSize};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90%;
    `,
  };
};
