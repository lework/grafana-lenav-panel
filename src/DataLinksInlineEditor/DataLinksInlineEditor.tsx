import React, { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { cloneDeep } from 'lodash';
import { Button, Modal, useStyles2, IconButton, ConfirmModal, Input, Icon } from '@grafana/ui';
import { DataFrame, GrafanaTheme2, VariableSuggestion } from '@grafana/data';
import { DataLink } from './datalink';
import { DataLinksListItem } from './DataLinksListItem';
import { DataLinkEditorModalContent } from './DataLinkEditorModalContent';
import { useTranslation } from 'react-i18next';

interface DataLinksInlineEditorProps {
  links?: DataLink[];
  onChange: (links: DataLink[]) => void;
  getSuggestions: () => VariableSuggestion[];
  data: DataFrame[];
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'group' | 'sort' | 'title' | 'url' | 'targetBlank' | 'roles';

export const DataLinksInlineEditor: React.FC<DataLinksInlineEditorProps> = ({
  links,
  onChange,
  getSuggestions,
  data,
}) => {
  const { t } = useTranslation();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const styles = useStyles2(getDataLinksInlineEditorStyles);
  const linksSafe: DataLink[] = useMemo(() => links ?? [], [links]);
  const isEditing = editIndex !== null;

  const filteredAndSortedLinks = useMemo(() => {
    let result = [...linksSafe];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(link => 
        (link.title?.toLowerCase() || '').includes(searchLower) ||
        (link.url?.toLowerCase() || '').includes(searchLower) ||
        (link.group?.toLowerCase() || '').includes(searchLower) ||
        (link.roles && link.roles.some(role => 
          role.toLowerCase().includes(searchLower)
        ))
      );
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === 'sort') {
          aValue = aValue ?? 0;
          bValue = bValue ?? 0;
        } else if (sortField === 'targetBlank') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        } else if (sortField === 'group') {
          aValue = (aValue || t('linkEditor.tableCells.defaultGroup')).toString().toLowerCase();
          bValue = (bValue || t('linkEditor.tableCells.defaultGroup')).toString().toLowerCase();
        } else if (sortField === 'roles') {
          aValue = a.roles ? a.roles.length : 0;
          bValue = b.roles ? b.roles.length : 0;
        } else {
          aValue = (aValue || '').toString().toLowerCase();
          bValue = (bValue || '').toString().toLowerCase();
        }

        if (aValue < bValue) {return sortDirection === 'asc' ? -1 : 1;}
        if (aValue > bValue) {return sortDirection === 'asc' ? 1 : -1;}
        return 0;
      });
    }

    return result;
  }, [linksSafe, searchTerm, sortField, sortDirection, t]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {return 'arrows-v';}
    if (sortDirection === 'asc') {return 'arrow-up';}
    if (sortDirection === 'desc') {return 'arrow-down';}
    return 'arrows-v';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortField(null);
    setSortDirection(null);
  };

  const onDataLinkChange = (index: number, link: DataLink) => {
    if (isNew) {
      if (link.title.trim() === '' && link.url.trim() === '') {
        setIsNew(false);
        setEditIndex(null);
        return;
      } else {
        setEditIndex(null);
        setIsNew(false);
      }
    }
    const update = cloneDeep(linksSafe);
    const originalIndex = linksSafe.findIndex(l => l === filteredAndSortedLinks[index]);
    if (originalIndex !== -1) {
      update[originalIndex] = link;
    } else {
      update[index] = link;
    }
    onChange(update);
    setEditIndex(null);
  };

  const onDataLinkAdd = () => {
    let update = cloneDeep(linksSafe);
    setEditIndex(update.length);
    setIsNew(true);
  };

  const onDataLinkCancel = (index: number) => {
    if (isNew) {
      setIsNew(false);
    }
    setEditIndex(null);
  };

  const onDataLinkRemove = (index: number) => {
    const update = cloneDeep(linksSafe);
    const originalIndex = linksSafe.findIndex(l => l === filteredAndSortedLinks[index]);
    if (originalIndex !== -1) {
      update.splice(originalIndex, 1);
      onChange(update);
    }
    setDeleteIndex(null);
  };

  const columns = [
    {
      id: 'group',
      header: t('linkEditor.tableHeaders.group'),
      accessorKey: 'group',
      sortable: true,
      cell: (row: DataLink) => row.group || t('linkEditor.tableCells.defaultGroup'),
      minSize: 80,
    },
    {
      id: 'sort',
      header: t('linkEditor.tableHeaders.sort'),
      accessorKey: 'sort',
      sortable: true,
      cell: (row: DataLink) => row.sort ?? 0,
      minSize: 60,
    },
    {
      id: 'title',
      header: t('linkEditor.tableHeaders.title'),
      accessorKey: 'title',
      sortable: true,
      cell: (row: DataLink, index: number) => (
        <div className={styles.titleCell} style={{ color: row.color || 'inherit' }}>
          {row.title || t('linkEditor.tableCells.noTitle')}
        </div>
      ),
      minSize: 120,
    },
    {
      id: 'url',
      header: t('linkEditor.tableHeaders.url'),
      accessorKey: 'url',
      sortable: true,
      cell: (row: DataLink) => (
        <div className={styles.urlCell} title={row.url}>
          {row.url || t('linkEditor.tableCells.noUrl')}
        </div>
      ),
      minSize: 200,
    },
    {
      id: 'roles',
      header: t('linkEditor.tableHeaders.roles'),
      accessorKey: 'roles',
      sortable: true,
      cell: (row: DataLink) => {
        if (!row.roles || row.roles.length === 0) {
          return <span className={styles.allUserBadge}>{t('linkEditor.tableCells.allUsersVisible')}</span>;
        }
        return (
          <div className={styles.rolesList}>
            {row.roles.map((role, idx) => (
              <span key={idx} className={styles.roleBadge} data-role={role}>
                {role}
              </span>
            ))}
          </div>
        );
      },
      minSize: 120,
    },
    {
      id: 'targetBlank',
      header: t('linkEditor.tableHeaders.targetBlank'),
      accessorKey: 'targetBlank',
      sortable: true,
      cell: (row: DataLink) => (row.targetBlank ? t('linkEditor.tableCells.yes') : t('linkEditor.tableCells.no')),
      minSize: 60,
    },
    {
      id: 'actions',
      header: t('linkEditor.tableHeaders.actions'),
      sortable: false,
      cell: (row: DataLink, index: number) => (
        <div className={styles.actionButtons}>
          <IconButton 
            name="pen" 
            onClick={() => {
              const originalIndex = linksSafe.findIndex(l => l === row);
              setEditIndex(originalIndex);
            }} 
            aria-label={t('linkEditor.editLinkAria')}
            size="sm"
          />
          <IconButton 
            name="times" 
            onClick={() => setDeleteIndex(index)} 
            aria-label={t('linkEditor.deleteLinkAria')}
            size="sm"
          />
        </div>
      ),
      minSize: 100,
    },
  ];

  return (
    <>
      <div className={styles.buttonGroup}>
        <Button size="sm" icon="plus" onClick={onDataLinkAdd} variant="secondary">
          {t('linkEditor.addLink')}
        </Button>
        {linksSafe.length > 0 && (
          <Button size="sm" icon="table" onClick={() => setShowTableView(true)} variant="secondary">
            {t('linkEditor.manageLinks', { count: linksSafe.length })}
          </Button>
        )}
      </div>

      {linksSafe.length > 0 && linksSafe.length <= 3 && (
        <div className={styles.wrapper}>
          {linksSafe.map((l, i) => {
            return (
              <DataLinksListItem
                key={`${l.title}/${i}`}
                index={i}
                link={l}
                onChange={onDataLinkChange}
                onEdit={() => setEditIndex(i)}
                onRemove={() => setDeleteIndex(i)}
                data={data}
              />
            );
          })}
        </div>
      )}

      {showTableView && (
        <Modal
          title={t('linkEditor.manageLinks', { count: linksSafe.length })}
          isOpen={true}
          onDismiss={() => setShowTableView(false)}
          className={styles.tableModal}
        >
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.headerActions}>
                <Button size="sm" icon="plus" onClick={onDataLinkAdd} variant="primary">
                  {t('linkEditor.addNewLink')}
                </Button>
                <div className={styles.searchAndFilter}>
                  <Input
                    placeholder={t('linkEditor.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    prefix={<Icon name="search" />}
                    width={30}
                  />
                  {(searchTerm || sortField) && (
                    <Button size="md" icon="times" onClick={clearFilters} variant="secondary">
                      {t('linkEditor.clearFilters')}
                    </Button>
                  )}
                </div>
              </div>
              {searchTerm && (
                <div className={styles.searchResults}>
                  {t('linkEditor.searchResults', { count: filteredAndSortedLinks.length })}
                </div>
              )}
            </div>
            
            {filteredAndSortedLinks.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.id} className={styles.tableHeaderCell}>
                          <div className={styles.headerContent}>
                            <span>{column.header}</span>
                            {column.sortable && (
                              <IconButton
                                name={getSortIcon(column.accessorKey as SortField)}
                                onClick={() => handleSort(column.accessorKey as SortField)}
                                size="sm"
                                className={styles.sortButton}
                                aria-label={t('linkEditor.sortByAria', { field: column.header })}
                              />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedLinks.map((link, index) => (
                      <tr key={index} className={styles.tableRow}>
                        {columns.map((column) => (
                          <td key={column.id} className={styles.tableCell}>
                            {column.cell(link, index)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : linksSafe.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t('linkEditor.emptyStateNoLinks')}</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>{t('linkEditor.emptyStateNoMatches')}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {isEditing && editIndex !== null && (
        <Modal
          title={isNew ? t('linkEditor.addLink') : t('linkEditor.editLink')}
          isOpen={true}
          closeOnBackdropClick={false}
          onDismiss={() => {
            onDataLinkCancel(editIndex);
          }}
        >
          <DataLinkEditorModalContent
            index={editIndex}
            link={isNew ? { title: '', url: '', icon: 'link', color: '', group: '', sort: 0 } : linksSafe[editIndex]}
            data={data}
            existingLinks={linksSafe}
            onSave={onDataLinkChange}
            onCancel={onDataLinkCancel}
            getSuggestions={getSuggestions}
          />
        </Modal>
      )}

      {deleteIndex !== null && (
        <ConfirmModal
          isOpen={true}
          title={t('linkEditor.deleteLink')}
          body={t('linkEditor.deleteConfirmBody', { title: filteredAndSortedLinks[deleteIndex]?.title || t('linkEditor.tableCells.unnamed') })}
          confirmText={t('linkEditor.deleteConfirmButton')}
          onConfirm={() => onDataLinkRemove(deleteIndex)}
          onDismiss={() => setDeleteIndex(null)}
        />
      )}
    </>
  );
};

const getDataLinksInlineEditorStyles = (theme: GrafanaTheme2) => {
  return {
    buttonGroup: css`
      display: flex;
      gap: ${theme.spacing(1)};
      margin-bottom: ${theme.spacing(2)};
    `,
    wrapper: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    tableModal: css`
      width: 90vw;
      max-width: 1200px;
      height: auto;
    `,
    tableContainer: css`
      height: calc(80vh - 120px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `,
    tableHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${theme.spacing(2)};
      padding-bottom: ${theme.spacing(1)};
      border-bottom: 1px solid ${theme.colors.border.medium};
      flex-shrink: 0;
    `,
    tableWrapper: css`
      overflow: auto;
      flex: 1;
    `,
    table: css`
      width: 100%;
      border-collapse: collapse;
      font-size: ${theme.typography.bodySmall.fontSize};
    `,
    tableHeaderCell: css`
      padding: ${theme.spacing(1)};
      text-align: left;
      font-weight: ${theme.typography.fontWeightMedium};
      background-color: ${theme.colors.background.secondary};
      border-bottom: 2px solid ${theme.colors.border.medium};
      white-space: nowrap;
    `,
    tableRow: css`
      &:nth-child(even) {
        background-color: ${theme.colors.background.secondary};
      }
      &:hover {
        background-color: ${theme.colors.action.hover};
      }
    `,
    tableCell: css`
      padding: ${theme.spacing(1)};
      border-bottom: 1px solid ${theme.colors.border.weak};
      vertical-align: top;
    `,
    titleCell: css`
      font-weight: ${theme.typography.fontWeightMedium};
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    urlCell: css`
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: ${theme.colors.text.secondary};
    `,
    actionButtons: css`
      display: flex;
      gap: ${theme.spacing(0.5)};
    `,
    emptyState: css`
      text-align: center;
      padding: ${theme.spacing(4)};
      color: ${theme.colors.text.secondary};
    `,
    headerActions: css`
      display: flex;
      margin-top: ${theme.spacing(1)};
      gap: ${theme.spacing(1)};
      align-items: center;
    `,
    searchAndFilter: css`
      display: flex;
      gap: ${theme.spacing(1)};
      height: 20px;
      align-items: center;
    `,
    searchResults: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    headerContent: css`
      display: flex;
      align-items: center;
    `,
    sortButton: css`
      margin-left: ${theme.spacing(0.5)};
    `,
    allUserBadge: css`
      background-color: ${theme.colors.background.secondary};
      color: ${theme.colors.text.primary};
      padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
      border-radius: ${theme.shape.radius.default};
      font-size: ${theme.typography.bodySmall.fontSize};
      display: inline-block;
    `,
    rolesList: css`
      display: flex;
      flex-wrap: wrap;
      gap: ${theme.spacing(0.5)};
    `,
    roleBadge: css`
      display: inline-block;
      padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
      border-radius: ${theme.shape.radius.default};
      font-size: ${theme.typography.bodySmall.fontSize};
      font-weight: ${theme.typography.fontWeightMedium};
      background-color: ${theme.colors.background.secondary};
      color: ${theme.colors.text.primary};

      &[data-role="Admin"] {
        background-color: ${theme.colors.error.main};
        color: ${theme.colors.error.contrastText};
      }
      &[data-role="Editor"] {
        background-color: ${theme.colors.warning.main};
        color: ${theme.colors.warning.contrastText};
      }
      &[data-role="Viewer"] {
        background-color: ${theme.colors.success.main};
        color: ${theme.colors.success.contrastText};
      }
    `,
  };
};
