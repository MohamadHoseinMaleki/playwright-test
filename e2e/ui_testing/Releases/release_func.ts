import { test, expect, Page } from '@playwright/test';
import { waitForMessage } from '../general/general';
import { search } from '../Groups/group_func';

export async function find_release_row(page, imei1, imei2, serial){ // get imeis and serial and find the row
    let forg_install_obj = {
      index: '',
      imei1: '',
      imei2: '',
      serial: '',
      admin: '',
      date: '',
    }
    const rows = await page.locator('tbody tr');
    const rowCount = await rows.count();
    for(let i=rowCount-1; i>=1; i--){
      const row = rows.nth(i);
      const index = await row.locator('td').nth(1).innerText();
      const findImei1 = await row.locator('td').nth(3).innerText();
      const findImei2 = await row.locator('td').nth(4).innerText();
      const findSerial = await row.locator('td').nth(5).innerText();
      if(imei1 == findImei1 && imei2 == findImei2 && serial == findSerial){
        const findAdmin = await row.locator('td').nth(6).innerText();
        const findDate = await row.locator('td').nth(7).innerText();
        forg_install_obj.index = index;
        forg_install_obj.imei1 = findImei1;
        forg_install_obj.imei2 = findImei2;
        forg_install_obj.serial = findSerial ;
        forg_install_obj.admin = findAdmin;
        forg_install_obj.date = findDate;
        console.log('find_row: ', forg_install_obj);
        return forg_install_obj;
      }
    }
    return null;
}

export async function check_release_row(page, imei1, imei2, serial) {
    //find row added
    const check_response = await find_release_row(page, imei1, imei2, serial);
    if(check_response == null) {
    console.log("test failed. row not added in forg install page", imei1, imei2, serial)
    test.fail();
    return null;
    }
    //check admin
    const locator1 = page.locator('span.name___WfKAK.anticon');
    const headerText = await locator1.textContent();
    await expect(page.locator('tbody')).toContainText(`${headerText}`);
    if (headerText != check_response.admin){
    console.log('test failed. admin has problem');
    test.fail();
    return null;
    }
    console.log('check_row: ', check_response);
    return check_response;

}

export async function add_release(page, imei1, imei2, serial){
await page.getByRole('button', { name: 'افزودن' }).click();
await expect(page.getByRole('button', { name: 'افزودن' })).toBeDisabled();//disable add button
await page.getByRole('textbox').nth(1).click();
await page.getByRole('textbox').nth(1).fill(imei1);
await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(imei2);
await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(serial);
//await expect(page.getByRole('row', { name: `${rowCount} ${randomImei1}` }).getByLabel('')).toBeDisabled();
await page.getByText('تایید').waitFor({state: 'visible'});
await page.getByText('تایید').click();
//check
const response = await check_release_row(page, imei1, imei2, serial);
console.log('add_release: ', response);
return response;
}

export async function delete_release(page, index, imei1 , imei2, serial){
    await page.getByRole('row', { name: `${index} ${imei1}` }).locator('a').nth(1).click();
    await page.getByRole('button', { name: 'تایید' }).click();
    await waitForMessage(page, 'تغییرات با موفقیت اعمال شد');
    await expectRowNotVisible(page, imei1, imei2, serial);
  }
  

export async function expectRowNotVisible(page, imei1, imei2, serial){
    await expect(async () => {
        const row = page.locator('tbody tr').filter({
        has: page.locator('td', {
            hasText: new RegExp(`${imei1}.*${imei2}.*${serial}`)
        })
        })
        const isVisible = await row.isVisible();
        expect(isVisible).toBe(false);
    }).toPass({
        timeout: 5000,
        intervals: [1000, 2000]
    });

}

export async function isUppercase(page ,str) {
  return str === str.toUpperCase();
}

export async function load_release(page) {
  await page.waitForSelector('.ant-table-body', {
    state: 'visible' 
  });

  await page.waitForSelector('.ant-table-row', {
    state: 'visible' 
  });
}

// export async function editelease(page:Page, imei1,imei2) {
//   await find_release_row(page,imei1,);

// }