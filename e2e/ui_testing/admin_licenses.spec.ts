import { test, expect } from '@playwright/test';



test('test', async ({ page }) => {
  await page.goto('http://192.168.136.90/');
  await page.goto('http://192.168.136.90/user/login');
  await page.goto('http://192.168.136.90/user/login/');
  await page.getByPlaceholder('نام کاربری').fill('admin');
  await page.getByPlaceholder('نام کاربری').press('Tab');
  await page.getByPlaceholder('رمزعبور').fill('admin');
  await page.getByPlaceholder('رمزعبور').press('Shift+CapsLock');
  await page.getByPlaceholder('رمزعبور').fill('admin@123');
  await page.getByPlaceholder('رمزعبور').press('Enter');
  await page.getByRole('link', { name: 'مجوزها' }).click();
  await page.getByRole('button', { name: 'plus مجوز جدید' }).click();
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill('t_lic3');
  await page.getByLabel('نام').press('Tab');
  await page.getByLabel('ظرفیت').fill('3');
  await page.getByLabel('ظرفیت').press('Tab');
  await page.getByLabel('توضیحات').press('Tab');
  await page.getByRole('button', { name: 'لغو' }).press('Tab');
  await page.getByRole('button', { name: 'تایید' }).press('Enter');
  await expect(page.getByRole('rowgroup')).toContainText('t_lic3');
  await expect(page.getByRole('rowgroup')).toContainText('3', {timeout: 5000});

  await page.getByRole('button', { name: 'plus مجوز جدید' }).click();
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill('t_lic2');
  await page.getByLabel('نام').press('Tab');
  await page.getByLabel('ظرفیت').fill('2');
  await page.getByLabel('ظرفیت').press('Tab');
  await page.getByLabel('توضیحات').press('Tab');
  await page.getByRole('button', { name: 'لغو' }).press('Tab');
  await page.getByRole('button', { name: 'تایید' }).press('Enter');
  await expect(page.getByRole('rowgroup')).toContainText('t_lic2');
  await expect(page.getByRole('rowgroup')).toContainText('2');

  await page.getByRole('link', { name: 'مدیران' }).click();
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.getByLabel('نام کاربری').click();
  await page.getByLabel('نام کاربری').fill('t_admin');
  await page.getByLabel('نام کاربری').press('Tab');
  await page.getByLabel('رمزعبور').fill('pass@123');
  await page.getByLabel('eye-invisible').locator('svg').click();
  await page.getByLabel('مجوز').click();
  await page.getByText('t_lic3').click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.getByRole('rowgroup')).toContainText('t_admin');
  await expect(page.getByRole('rowgroup')).toContainText('t_lic3');
  await page.getByRole('link', { name: 'مجوزها' }).click();
  await page.getByRole('row', { name: 't_lic3 3' }).locator('a').first().click();
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill('t_lic5');
  await page.getByLabel('ظرفیت').click();
  await page.getByLabel('ظرفیت').fill('5');
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('link', { name: 'مدیران' }).click();
  await expect(page.getByRole('rowgroup')).toContainText('t_lic5');
  
  await page.getByRole('row', { name: 't_admin t_lic5' }).locator('a').nth(2).click();
  await page.getByText('t_lic5 5').click();
  await page.getByText('t_lic2').click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.getByRole('rowgroup')).toContainText('t_lic2');

  await page.getByRole('row', { name: 't_admin t_lic2' }).locator('a').nth(3).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('link', { name: 'مجوزها' }).click();
  await page.getByRole('row', { name: 't_lic5 5' }).getByLabel('').check();
  await page.getByRole('button', { name: 'delete حذف' }).click();

});