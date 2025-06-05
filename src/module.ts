import { PanelPlugin } from '@grafana/data';
import { NavOptions } from './types';
import { NavPanel } from './NavPanel';
import { DataLinksValueEditor } from './DataLinksInlineEditor/DataLinksValueEditor';
import { getPanelOptionsText } from './i18n';

// 获取国际化的面板选项文本
const t = getPanelOptionsText();

export const plugin = new PanelPlugin<NavOptions>(NavPanel).setPanelOptions((builder) => {
  const mainCategory = [t.category];

  return builder
    .addBooleanSwitch({
      path: 'showLinkIcon',
      name: t.showLinkIcon,
      defaultValue: true,
      category: mainCategory,
    })
    .addBooleanSwitch({
      path: 'showGroupName',
      name: t.showGroupName,
      defaultValue: true,
      category: mainCategory,
    })
    .addNumberInput({
      path: 'navTitleSize',
      name: t.navTitleSize.name,
      settings: {
        min: 8,
        max: 32,
        step: 1,
        placeholder: '14',
      },
      defaultValue: 14,
      category: mainCategory,
    })
    .addNumberInput({
      path: 'navWidth',
      name: t.navWidth.name,
      defaultValue: 160,
      settings: {
        placeholder: t.navWidth.placeholder,
        integer: false,
        min: 80,
        max: 200,
      },
      category: mainCategory,
    })
    .addSelect({
      path: 'navTheme',
      name: t.navTheme.name,
      category: mainCategory,
      defaultValue: 'default',
      settings: {
        options: [
          { value: 'default', label: t.navTheme.default },
          { value: 'box', label: t.navTheme.box },
        ],
      },
    })
    .addCustomEditor({
      id: 'navData',
      path: 'navData',
      name: t.navData,
      category: mainCategory,
      editor: DataLinksValueEditor as any,
    });
});
