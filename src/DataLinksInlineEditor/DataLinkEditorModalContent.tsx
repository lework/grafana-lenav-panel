import { DataFrame, VariableSuggestion } from '@grafana/data';
import React, { FC, useState, useMemo } from 'react';
import { DataLinkEditor } from './DataLinkEditor';
import { Button, Modal } from '@grafana/ui';
import { DataLink } from './datalink';
import { useTranslation } from 'react-i18next';

interface DataLinkEditorModalContentProps {
  link: DataLink;
  index: number;
  data: DataFrame[];
  existingLinks?: DataLink[];
  getSuggestions: () => VariableSuggestion[];
  onSave: (index: number, ink: DataLink) => void;
  onCancel: (index: number) => void;
}

export const DataLinkEditorModalContent: FC<DataLinkEditorModalContentProps> = ({
  link,
  index,
  getSuggestions,
  existingLinks,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [dirtyLink, setDirtyLink] = useState(link);
  
  // 验证链接是否有效
  const isLinkValid = useMemo(() => {
    return !!(dirtyLink.title?.trim() && dirtyLink.url?.trim());
  }, [dirtyLink.title, dirtyLink.url]);
  
  return (
    <>
      <DataLinkEditor
        value={dirtyLink}
        index={index}
        isLast={false}
        suggestions={getSuggestions()}
        existingLinks={existingLinks}
        onChange={(index, link) => {
          setDirtyLink(link);
        }}
      />
      <Modal.ButtonRow>
        <Button variant="secondary" onClick={() => onCancel(index)} fill="outline">
          {t('linkEditor.cancelButton')}
        </Button>
        <Button
          disabled={!isLinkValid}
          onClick={() => {
            if (isLinkValid) {
              onSave(index, dirtyLink);
            }
          }}
        >
          {t('linkEditor.saveButton')}
        </Button>
      </Modal.ButtonRow>
    </>
  );
};
