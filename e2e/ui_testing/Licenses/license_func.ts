import { test, expect, Page } from '@playwright/test';
import { search } from '../Groups/group_func';
import { link } from 'fs';
import { waitForToastMessage } from '../general/general';


export async function find_license_row(page:Page, license){ // get name and capacity then find the row
    let forg_license_obj = {
      index: '',
      name: '',
      capacity: ''
    }  
    const rows = await page.getByRole('row');
    const rowCount = await rows.count();
    console.log('rowCount: ', rowCount);
    for(let i=rowCount; i>=1; i--){
      const row = rows.nth(i);
      console.log('row', row);
      const index = await row.getByRole('cell').nth(1).innerText();
      const findName = await row.getByRole('cell').nth(2).innerText();
      const findCapacity = await row.getByRole('cell').nth(3).innerText();
      console.log('index: ', index);
      console.log('findName: ', findName);
      console.log('findCapacity: ', findCapacity);
  
      if(license.name == findName && license.capacity == findCapacity){
        forg_license_obj.index = index;
        forg_license_obj.name = license.name;
        forg_license_obj.capacity = license.capacity;
        console.log('find_license_row: ', forg_license_obj);
        return forg_license_obj;
      }
    }
    return null;
  }
  
  export async function create_license(page:Page, license){
    await page.getByRole('button', { name: 'plus مجوز جدید' }).click();
    await page.getByLabel('نام').waitFor({state: 'visible'});
    await page.getByLabel('نام').click();
    await page.getByLabel('نام').fill(license.name);
    await page.getByLabel('ظرفیت').click();
    await page.getByLabel('ظرفیت').fill(license.capacity);
    await page.getByLabel('ظرفیت').press('Tab');
    await page.getByLabel('توضیحات').press('Tab');
    await page.getByRole('button', { name: 'لغو' }).press('Tab');
    await page.getByRole('button', { name: 'تایید' }).press('Enter');
    // // if the license page is full maybe this line has error.
    // const check_response = await find_license_row(page, license);
    // if(check_response == null) {
    //   console.log("test failed. row not added in forg license page", license.name, license.capacity)
    //   test.fail();
    //   return null;
    // }
    // return check_response;
  }


  export async function edit_license(page:Page,licenseName: string,newname: string) {
    await search(page, licenseName);
    await page.getByRole('row', { name: licenseName }).locator('a').first().click();
    await page.mouse.move(10, 10);
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.getByLabel('نام').click();
    await page.getByLabel('نام').fill(newname);
    await page.getByRole('button', { name: 'تایید' }).click();
    await page.waitForTimeout(300);
    console.log('edit_license'+{licenseName});
  }

  export async function delete_license(page:Page,licenseName: string) {
    await search(page, licenseName);
    await page.getByRole('row', { name: licenseName }).locator('a').nth(1).click();
    // await page.waitForTimeout(500);
    await page.mouse.move(20,10);
    await page.locator('button', { hasText: 'تایید' }).click();
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
    // const ok =page.getByText('تغییرات با موفقیت اعمال شد'); 
    // expect(ok);
    await search(page,licenseName);
    // await page.waitForTimeout(300);
    await expect(page.getByRole('row', { name: licenseName })).toBeHidden();
    console.log('delete license '+{licenseName}+'is sucess')

  }

  module.exports = {
    find_license_row,
    create_license,
    edit_license,
    delete_license
  }