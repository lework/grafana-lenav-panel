import { test, expect } from '@grafana/plugin-e2e';

test('should display "ChatGPT" in case panel data is empty', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  await expect(panelEditPage.panel.locator).toContainText('ChatGPT');
});


test('should display group name when "showGroupName" option is enabled', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  page,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  const options = panelEditPage.getCustomOptions('Website Navigation');
  const showGroupName = options.getSwitch('Display group name');

  await showGroupName.check();
  await expect(page.getByTestId('simple-panel-group-name')).toBeVisible();
});
