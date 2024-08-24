import { expect, Page } from "@playwright/test";
import { search } from "../Groups/group_func";
import { waitForMessage, waitForToastMessage } from "../general/general";


export async function create_Bankdevice(page:Page, dname, dModel, DIos){
    await page.getByRole('button', { name: 'plus افزودن دستگاه' }).click();
    await page.getByLabel('سازنده').waitFor({state: 'visible'});
    await page.getByLabel('سازنده').click();
    await page.getByLabel('سازنده').fill(dname);
    await page.getByLabel('مدل').click();
    await page.getByLabel('مدل').fill(dModel);
    await page.getByLabel('مدل').press('Tab');
    await page.getByLabel('سیستم عامل').press('Tab');
    await page.getByRole('button', { name: 'تایید' }).press('Enter');
  }


export async function edit_device(page:Page,deviceName: string, newname: string) {
    await search(page, deviceName);
    await page.getByRole('row', { name: deviceName }).locator('a').first().click();
    await page.mouse.move(10, 10);
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.getByLabel('نام').click();
    await page.getByLabel('نام').fill(newname);
    await page.getByRole('button', { name: 'تایید' }).click();
    await page.waitForTimeout(300);
    console.log('edit_license'+{deviceName});
};

export async function delete_device(page:Page,deviceName: string) {
    await search(page, deviceName);
    await page.getByRole('row', { name: 'Toggle Row Expanded 1' }).locator('a').nth(1).click();
    await page.locator('button', { hasText: 'تایید' }).click();
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
    await search(page,deviceName);
    await expect(page.getByRole('row', { name: deviceName })).toBeHidden();
    console.log('delete license '+{deviceName}+'is sucess')
};