import React, { ChangeEvent, useMemo } from 'react';
import { VariableSuggestion, GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';
import { DataLink } from './datalink';
import { RoleType } from '../types';
import { Switch, useStyles2, Field, Input, DataLinkInput, ColorPicker, Combobox, ComboboxOption, MultiSelect } from '@grafana/ui';
import { useTranslation } from 'react-i18next';

interface DataLinkEditorProps {
  index: number;
  isLast: boolean;
  value: DataLink;
  suggestions: VariableSuggestion[];
  existingLinks?: DataLink[];
  onChange: (index: number, link: DataLink, callback?: () => void) => void;
}

const getStyles = (theme: GrafanaTheme2) => ({
  listItem: css`
    margin-bottom: ${theme.spacing()};
  `,
  infoText: css`
    padding-bottom: ${theme.spacing(2)};
    margin-left: 66px;
    color: ${theme.colors.text.secondary};
  `,
  formRow: css`
    display: flex;
    flex-direction: row;
    gap: ${theme.spacing(2)};
  `,
  formField: css`
    flex: 1;
    min-width: 0;
  `,
  fullWidth: css`
    width: 100%;
  `,
});

const defaultColor = 'rgb(221, 221, 221)';

// 默认角色列表
const defaultRoleOptions: Array<SelectableValue<RoleType>> = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' },
];

export const DataLinkEditor: React.FC<DataLinkEditorProps> = React.memo(
  ({ index, value, onChange, suggestions, isLast, existingLinks }) => {
    const { t } = useTranslation();
    const styles = useStyles2(getStyles);

    // 验证逻辑
    const validation = useMemo(() => {
      const titleError = !value.title?.trim() ? t('linkEditor.validationErrors.titleRequired') : '';
      const urlError = !value.url?.trim() ? t('linkEditor.validationErrors.urlRequired') : '';
      
      return {
        title: { error: titleError, invalid: !!titleError },
        url: { error: urlError, invalid: !!urlError },
      };
    }, [value.title, value.url, t]);

    const onUrlChange = (url: string, callback?: () => void) => {
      onChange(index, { ...value, url: url.trim() }, callback);
    };

    const onColorChange = (color: string, callback?: () => void) => {
      onChange(index, { ...value, color }, callback);
    };

    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(index, { ...value, title: event.target.value.trim() });
    };

    const onSortChange = (event: ChangeEvent<HTMLInputElement>) => {
      const sortValue = event.target.value === '' ? 0 : parseInt(event.target.value, 10);
      onChange(index, { ...value, sort: isNaN(sortValue) ? 0 : sortValue });
    };

    const onOpenInNewTabChanged = () => {
      onChange(index, { ...value, targetBlank: !value.targetBlank });
    };

    const getGroupOptions = (): ComboboxOption[] => {
      const existingGroups = existingLinks?.map(link => link.group).filter(Boolean) || [];
      const uniqueGroups = Array.from(new Set(existingGroups));
      return uniqueGroups.map(group => ({ label: group, value: group }));
    };

    const onGroupSelectChange = (selectedOption: ComboboxOption<string> | null) => {
      onChange(index, { ...value, group: selectedOption?.value.trim() || '' });
    };

    // 处理角色选择变更
    const onRolesChange = (roles: Array<SelectableValue<RoleType>>) => {
      const roleValues = roles.map(r => r.value!);
      onChange(index, { ...value, roles: roleValues });
    };

    if (value.color === '') {
      value.color = defaultColor;
    }

    const groupOptions = getGroupOptions();
    const currentGroupValue = value.group ? { label: value.group, value: value.group } : null;
    
    // 当前选中的角色
    const selectedRoles = (value.roles || []).map(role => ({
      label: role,
      value: role,
    }));

    return (
      <div className={styles.listItem}>
        <Field 
          label={t('linkEditor.formLabels.title')} 
          error={validation.title.error}
          invalid={validation.title.invalid}
          className={styles.fullWidth}
        >
          <Input 
            value={value.title || ''} 
            required 
            onChange={onTitleChange} 
            placeholder={t('linkEditor.formPlaceholders.title')}
            invalid={validation.title.invalid}
          />
        </Field>

        <Field 
          label={t('linkEditor.formLabels.url')}
          error={validation.url.error}
          invalid={validation.url.invalid}
          className={styles.fullWidth}
        >
          <DataLinkInput
            value={value.url || ''}
            onChange={onUrlChange}
            suggestions={suggestions}
            placeholder={t('linkEditor.formPlaceholders.url')}
          />
        </Field>

        <div className={styles.formRow}>
          <Field 
            label={t('linkEditor.formLabels.group')} 
            description={t('linkEditor.formDescriptions.group')}
            className={styles.formField}
          >
            <Combobox
              options={groupOptions}
              value={currentGroupValue}
              onChange={onGroupSelectChange}
              createCustomValue
              placeholder={t('linkEditor.formPlaceholders.group')}
              isClearable
            />
          </Field>

          <Field 
            label={t('linkEditor.formLabels.sort')} 
            description={t('linkEditor.formDescriptions.sort')}
            className={styles.formField}
          >
            <Input 
              type="number" 
              value={value.sort ?? 0} 
              onChange={onSortChange} 
              placeholder={t('linkEditor.formPlaceholders.sort')} 
              min={0}
              max={999}
            />
          </Field>
        </div>

        <div className={styles.formRow}>
          <Field 
            label={t('linkEditor.formLabels.fontColor')}
            className={styles.formField}
          >
            <ColorPicker color={value?.color ?? defaultColor} onChange={onColorChange} enableNamedColors={false} />
          </Field>

          <Field 
            label={t('linkEditor.formLabels.openInNewTab')}
            className={styles.formField}
          >
            <Switch value={value.targetBlank || false} onChange={onOpenInNewTabChanged} />
          </Field>
        </div>

        <Field 
          label={t('linkEditor.formLabels.authorizedRoles')} 
          description={t('linkEditor.formDescriptions.authorizedRoles')}
          className={styles.fullWidth}
        >
          <MultiSelect
            options={defaultRoleOptions}
            value={selectedRoles}
            onChange={onRolesChange}
            placeholder={t('linkEditor.formPlaceholders.roles')}
            isClearable
          />
        </Field>

        {isLast && (
          <div className={styles.infoText}>
            {t('linkEditor.infoText')}
          </div>
        )}
      </div>
    );
  }
);

DataLinkEditor.displayName = 'DataLinkEditor';
