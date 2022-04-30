import React, { ChangeEvent } from 'react';
import { VariableSuggestion, GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { DataLink } from './datalink';
import { Switch, useStyles2, Field, Input, DataLinkInput, ColorPicker } from '@grafana/ui';

interface DataLinkEditorProps {
  index: number;
  isLast: boolean;
  value: DataLink;
  suggestions: VariableSuggestion[];
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
});

const defaultColor = 'rgb(221, 221, 221)';

export const DataLinkEditor: React.FC<DataLinkEditorProps> = React.memo(
  ({ index, value, onChange, suggestions, isLast }) => {
    const styles = useStyles2(getStyles);

    const onUrlChange = (url: string, callback?: () => void) => {
      onChange(index, { ...value, url }, callback);
    };

    const onGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(index, { ...value, group: event.target.value });
    };

    const onColorChange = (color: string, callback?: () => void) => {
      onChange(index, { ...value, color }, callback);
    };

    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(index, { ...value, title: event.target.value });
    };

    const onOpenInNewTabChanged = () => {
      onChange(index, { ...value, targetBlank: !value.targetBlank });
    };

    if (value.color == '') {
      value.color = defaultColor
    }

    return (
      <div className={styles.listItem}>
        <Field label="Title">
          <Input value={value.title} required onChange={onTitleChange} placeholder="baidu" />
        </Field>

        <Field label="URL">
          <DataLinkInput value={value.url} onChange={onUrlChange} suggestions={suggestions} placeholder="https://www.baidu.com" />
        </Field>

        <Field label="Group">
          <Input value={value.group} onChange={onGroupChange} placeholder="default" />
        </Field>

        <Field label="Font Color">
          <ColorPicker color={value?.color ?? defaultColor} onChange={onColorChange} enableNamedColors={false} />
        </Field>

        <Field label="TargetBlank">
          <Switch value={value.targetBlank || false} onChange={onOpenInNewTabChanged} />
        </Field>

        {isLast && (
          <div className={styles.infoText}>
            With data links you can reference data variables like series name, labels and values. Type CMD+Space,
          </div>
        )}
      </div>
    );
  }
);

DataLinkEditor.displayName = 'DataLinkEditor';
