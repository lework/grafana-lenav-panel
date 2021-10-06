import React from 'react';
import { DataLinksFieldConfigSettings, FieldConfigEditorProps, VariableSuggestionsScope } from '@grafana/data';
import { DataLink } from './datalink';
import { DataLinksInlineEditor } from './DataLinksInlineEditor';

export const DataLinksValueEditor: React.FC<FieldConfigEditorProps<DataLink[], DataLinksFieldConfigSettings>> = ({
  value,
  onChange,
  context,
}) => {
  return (
    <DataLinksInlineEditor
      links={value}
      onChange={onChange}
      data={context.data}
      getSuggestions={() => (context.getSuggestions ? context.getSuggestions(VariableSuggestionsScope.Values) : [])}
    />
  );
};
