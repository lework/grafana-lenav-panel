import React from 'react';
import { StandardEditorProps, VariableSuggestionsScope } from '@grafana/data';
import { DataLinksInlineEditor } from './DataLinksInlineEditor';

export const DataLinksValueEditor: React.FC<StandardEditorProps<any, any, any>> = ({
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
