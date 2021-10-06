import { PanelPlugin } from '@grafana/data';
import { NavOptions } from './types';
import { NavPanel } from './NavPanel';

import { DataLinksValueEditor } from './DataLinksInlineEditor/DataLinksValueEditor';


export const plugin = new PanelPlugin<NavOptions>(NavPanel)
  .setPanelOptions(builder => {

  const mainCategory = ['导航配置'];
  
  return builder
    .addBooleanSwitch({
      path: 'showLinkIcon',
      name: '显示图标',
      defaultValue: false,
      category: mainCategory,
    })
    .addBooleanSwitch({
      path: 'showGroupName',
      name: '显示组名',
      defaultValue: false,
      category: mainCategory,
    })
    .addRadio({
      path: 'navTitleSize',
      defaultValue: 'md',
      name: '字体大小',
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
    name: '链接宽度',
    defaultValue: 160,
    settings: {
      placeholder: 'Auto',
      integer: false,
      min: 100,
      max: 200,
    },
    category: mainCategory,
  })
  .addSelect({
    path: 'navTheme',
    name: '导航样式',
    category: mainCategory,
    // description: '导航显示的样式',
    defaultValue: 'default',
    settings: {
        options: [{value: 'default', label: 'Default' }, {value: 'box', label: 'Box' }]
    },
  })
    .addCustomEditor({
      id: 'navData',
      path: 'navData',
      name: '链接',
      category: mainCategory,
      editor: DataLinksValueEditor as any,
    })
});
