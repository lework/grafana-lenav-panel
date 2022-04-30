import { PanelPlugin } from '@grafana/data';
import { NavOptions } from './types';
import { NavPanel } from './NavPanel';
import { DataLinksValueEditor } from './DataLinksInlineEditor/DataLinksValueEditor';

export const plugin = new PanelPlugin<NavOptions>(NavPanel).setPanelOptions((builder) => {
  const mainCategory = ['Navigation configuration'];

  return builder
    .addBooleanSwitch({
      path: 'showLinkIcon',
      name: 'Display icon',
      defaultValue: true,
      category: mainCategory,
    })
    .addBooleanSwitch({
      path: 'showGroupName',
      name: 'Display group name',
      defaultValue: true,
      category: mainCategory,
    })
    .addRadio({
      path: 'navTitleSize',
      defaultValue: 'md',
      name: 'Font Size',
      category: mainCategory,
      settings: {
        options: [
          {
            value: 'sm',
            label: 'Small',
          },
          {
            value: 'md',
            label: 'Medium',
          },
          {
            value: 'lg',
            label: 'Large',
          },
        ],
      },
    })
    .addNumberInput({
      path: 'navWidth',
      name: 'Link width',
      defaultValue: 160,
      settings: {
        placeholder: 'Auto',
        integer: false,
        min: 80,
        max: 200,
      },
      category: mainCategory,
    })
    .addSelect({
      path: 'navTheme',
      name: 'Style',
      category: mainCategory,
      defaultValue: 'default',
      settings: {
        options: [
          { value: 'default', label: 'Default' },
          { value: 'box', label: 'Box' },
        ],
      },
    })
    .addCustomEditor({
      id: 'navData',
      path: 'navData',
      name: 'Link',
      category: mainCategory,
      editor: DataLinksValueEditor as any,
    });
});
