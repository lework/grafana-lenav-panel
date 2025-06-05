import { test, expect } from '@grafana/plugin-e2e';

test('should display "Default" in case panel data is empty', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  await expect(panelEditPage.panel.locator).toContainText('Default');
});


test('should display group name when "Display group name" option is enabled', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  page,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  const options = panelEditPage.getCustomOptions('Navigation configuration');
  const showGroupName = options.getSwitch('Display group name');

  await showGroupName.check();
  await expect(page.getByTitle('AI')).toBeVisible();
});
