import { test, expect, _electron } from '@playwright/test';

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainWindow: Awaited<ReturnType<typeof electronApp.firstWindow>>;

test.beforeEach(async () => {
  electronApp = await _electron.launch({ args: ['.'] });
  mainWindow = await electronApp.firstWindow();
  await mainWindow.waitForLoadState('domcontentloaded');
});

test.afterEach(async () => {
  await electronApp.close();
});

test('Ai call form submission navigates to summary', async () => {
  await mainWindow.fill('input[type="text"]', 'https://www.forbes.com/sites/zacharyfolk/2025/11/16/northern-lights-forecast-aurora-could-be-visible-from-these-states-sunday/');
  await mainWindow.selectOption('select[name="action"]', 'summarize');
  await mainWindow.click('input[type="submit"]');
  await mainWindow.waitForSelector('text=Summary');
  const url = mainWindow.url();
  expect(url).toContain('/summary');
});

test('Ai call form submission navigates to fact-check', async () => {
  await mainWindow.fill('input[type="text"]', 'https://www.forbes.com/sites/zacharyfolk/2025/11/16/northern-lights-forecast-aurora-could-be-visible-from-these-states-sunday/');
  await mainWindow.selectOption('select[name="action"]', 'fact-check');
  await mainWindow.click('input[type="submit"]');
  await mainWindow.waitForSelector('text=Fact-Check');
  const url = mainWindow.url();
  expect(url).toContain('/factcheck');
});



