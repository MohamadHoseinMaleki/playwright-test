// @ts-check
import { test, expect, Page } from '@playwright/test';
import {create_license, delete_license} from '../Licenses/license_func';
import {generateRandomString, waitForMessage, login, getRandomNumber, load} from '../general/general';
import { find_release_row, check_release_row, add_release, expectRowNotVisible, delete_release, isUppercase, load_release} from './release_func';
import { create_miniadmin, deleteAdmin, find_miniadmin_row} from '../Admins/admins_func'
import { search } from '../Groups/group_func';
import { getJWT } from '../../api_testing/general';

const randomImei1 = generateRandomString(15, 'imei');
const randomImei2 = generateRandomString(15, 'imei');
const randomSerial = generateRandomString(5, 'serial');
const imei1 = generateRandomString(15, 'imei');
const newSerial = generateRandomString(5, 'serial');
const newImei2 = generateRandomString(15, 'imei');

const adminImei1 = generateRandomString(15, 'imei');
const adminImei2 = generateRandomString(15, 'imei');
const adminNewImei1 = generateRandomString(15, 'imei');
const adminNewImei2 = generateRandomString(15, 'imei');
const adminNewSerial = generateRandomString(5, 'serial');
const adminSerial = generateRandomString(5, 'serial');
const superAdminName = 'admin';
const superAdminPass = 'admin@123';


//add , edit , delete
test('test_release', async ({ page }) => {
  await login(page, superAdminName, superAdminPass);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  await load_release(page);
  //find table row count
  await page.locator('tr').first().waitFor();
  let rowCount = await page.locator('tbody tr').count();
  console.log('rowCount: ', rowCount);

  //add correctly and check
  const added_obj = await add_release(page, randomImei1, randomImei2, randomSerial);
  console.log('added_obj: ', added_obj);
  if(added_obj == null){
    test.fail();
  }

  console.log('added_obj: ', added_obj);

    if (added_obj == null) {
        test.fail();
    }
    // big charakter
    expect(isUppercase(page,randomSerial)).toBe(true);
    //check admin
    await search(page,added_obj);
    const isPresent =  page.getByRole('cell', { name: 'admin' }).locator('span');
    expect(isPresent);
    


  //cancel in edit
  await page.getByRole('row', { name: `${added_obj?.index} ${randomImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').fill('DKFIRERTt');
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').fill('000222111111111');
  await page.getByRole('cell', { name: `${randomImei1} 15 /` }).getByRole('textbox').fill('000999966999999');
  await page.getByText('لغو').click();
  await check_release_row(page, randomImei1, randomImei2, randomSerial);
  // //cancel in add
  await page.getByRole('button', { name: 'افزودن' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(imei1);
  await page.getByText('لغو').click();
  await expect(page.locator('tbody').getByText(imei1)).not.toBeVisible();
  //ok in add ... but has problem
  await page.getByRole('button', { name: 'افزودن' }).click();
  await page.getByText('تایید').click();
  await waitForMessage(page, 'لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(imei1);
  await page.getByText('تایید').click();
  await waitForMessage(page, 'لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill('d');
  await waitForMessage(page, 'imei نامعتبر');
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill('ث');
  await waitForMessage(page, 'imei نامعتبر');
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill('ی');
  await waitForMessage(page, 'زبان صفحه کلید خود را به انگلیسی تغییر دهید');
  await page.getByRole('cell', { name: '15 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '15 / 15' }).getByRole('textbox').fill(randomImei1);
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(randomImei2);
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 50' }).getByRole('textbox').fill(randomSerial);
  await page.getByText('تایید').click();
  await waitForMessage(page, 'مقادیر وارد شده تکراری هستند (Code: 30)');
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').fill(newSerial);
  await page.getByText('تایید').click();
  const added_obj2 = await check_release_row(page, randomImei1, randomImei2, newSerial);
  if(added_obj2 == null){
    test.fail();
  }
  //edit
  await page.getByRole('row', { name: `${added_obj2?.index} ${randomImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${newSerial} 5 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${newSerial} 5 /` }).getByRole('textbox').fill(randomSerial);
  await page.getByText('تایید').click();
  await waitForMessage(page, 'مقادیر وارد شده تکراری هستند (Code: 30)');
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').fill(newImei2);
  await page.getByText('تایید').click();
  const edited_obj = await check_release_row(page, randomImei1, newImei2, randomSerial);
  if(edited_obj == null){
    test.fail();
  }
  await page.getByRole('row', { name: `${edited_obj?.index} ${randomImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').fill('');
  await page.getByText('تایید').click();
  await waitForMessage(page, 'لطفا مقادیر خواسته شده را وارد کنید');


  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(randomSerial);
  await page.getByRole('cell', { name: `${newImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${newImei2} 15 /` }).getByRole('textbox').fill('');
  await page.getByText('تایید').click();
  await waitForMessage(page, 'لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByText('لغو').click();
  const edited_obj2 = await check_release_row(page, randomImei1, newImei2, randomSerial);
  if(edited_obj2 == null){
    test.fail();
  }
  //delete
  await delete_release(page, edited_obj2?.index, randomImei1, newImei2, randomSerial );
  await delete_release(page, added_obj?.index, randomImei1, randomImei2, randomSerial);
  //not delete release  d - test released
  //same 2 rows in 2 mini admin - test same 2 rows in 2 admins

});

test('api test delete releese', async({request})=>{
  const jwtToken =  await getJWT(request);
  const url ='http://192.168.136.90/back-api/release'

  const requestData = {
    items: [
        {
            releaseId: "616"
        }
    ]
};

const response = await request.delete(url, {
  data: requestData,
  headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${jwtToken}`
  }
});

   expect(response.status()).toBeGreaterThanOrEqual(200);
   expect(response.status()).toBeLessThan(500);

   const responseBody = await response.json();
   expect(responseBody).toHaveProperty('message', 'delete release failed');
   expect(responseBody).toHaveProperty('payload');
   expect(responseBody.payload).toHaveProperty('toast', 'api.error.mutation');
   expect(responseBody.payload).toHaveProperty('items');
   expect(responseBody.payload.items[0]).toHaveProperty('id', '616');
   expect(responseBody.payload.items[0]).toHaveProperty('toast', 'api.error.mutation');
   expect(responseBody).toHaveProperty('result', 61);
})


//row should be exist
test ('released', async ({page}) => {
  await login(page, superAdminName, superAdminPass);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  await page.locator('tr').first().waitFor();
  const rowCount = await page.locator('tbody tr').count();
  console.log('rowCount: ', rowCount);
  let n=0;
  while(n<100){
    const randRowId = getRandomNumber(1, rowCount-1);
    const imei1Value = await page.locator('tbody tr').nth(randRowId).locator('td').nth(3).innerText();
    console.log('randrowid: ', randRowId);
    console.log('imei1Value: ', imei1Value);
    const isCheckedRow =  await page.getByRole('row', { name: `${randRowId} ${imei1Value}` }).getByLabel('').isEnabled();
    console.log('isCheckedRow: ', isCheckedRow);
    if(isCheckedRow){
      await page.getByRole('row', { name: `${randRowId} ${imei1Value}` }).getByLabel('').check();
      await page.getByRole('button', { name: 'تولید برنامه' }).click();
      await page.locator('tbody tr').nth(randRowId).locator('td').nth(2).hover();
      await expect(page.getByRole('tooltip')).toContainText('ریلیز شده');
      await expect(page.getByRole('row', { name: `${randRowId} ${imei1Value}` }).getByLabel('')).toBeDisabled(); // can not select released
      break;
    }
    n += 1;
  }
})

test('same 2 rows in 2 admins', async ({page}) => {
  await login(page, superAdminName, superAdminPass);

  const license = {
    name: generateRandomString(5, 'name'),
    capacity: getRandomNumber(3, 9).toString(),
  }
  const miniAdminName = generateRandomString(5, 'name');

  //create new license
  await page.getByRole('link', { name: 'مجوزها' }).click();
  await create_license(page, license);
  

  //create new mini admin and bind it to license
  await page.getByRole('link', { name: 'مدیران' }).click();
  await create_miniadmin(page, miniAdminName, 'pass@123', license.name);
  const check_miniadmin_row = await find_miniadmin_row(page, miniAdminName, license.name);
  if (check_miniadmin_row == null){
    test.fail();
    console.log('miniadmin not added');
    return;
  }
//

  await page.waitForSelector('span:has-text("خروج")'); 
  await page.getByText('خروج').click();
  //log mini admin
  await login(page,miniAdminName, 'pass@123');
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  await add_release(page,imei1,randomImei2,randomSerial);
  await page.waitForSelector('span:has-text("خروج")'); 
  await page.getByText('خروج').click();
  await login(page,superAdminName,superAdminName);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  // super admin edit row that mini admin make 
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').fill(newImei2);
  await page.getByText('تایید').click();
  const edited_obj = await check_release_row(page, randomImei1, newImei2, randomSerial);
  if(edited_obj == null){
    test.fail();
  }

 //delete mini admin ***
  await page.getByRole('link', { name: 'مدیران' }).click();
  await deleteAdmin(page,miniAdminName);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  const obj = await check_release_row(page,imei1, randomImei2, randomSerial);
  if(obj == null){
    test.fail();
  }
  //added items can delete in super admin
  await page.waitForSelector('span:has-text("خروج")'); 
  await page.getByText('خروج').click();
  await login(page,superAdminName,superAdminPass);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  if(obj?.admin !== null)
    test.fail;

  await delete_release(page,obj?.index,imei1,randomImei2,randomSerial);

  //delete licenses  ***
  await page.getByRole('link', { name: 'مدیران' }).click();
  await create_miniadmin(page, miniAdminName, 'pass@123', license.name);
  await page.getByRole('link', { name: 'مجوزها' }).click();
  await delete_license(page,license.name);

  //delete mini admin
  await page.getByRole('link', { name: 'مدیران' }).click();
  await deleteAdmin(page,miniAdminName);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  
  // avaibale mini admin and no license check api:
  



  

//


  // //add imei in super admin
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  const added_obj = await add_release(page, adminImei1, adminImei2, adminSerial);
  if(added_obj == null){
    test.fail();
    return;
  }
  // await page.getByRole('button', { name: 'افزودن' }).click();
  // await page.getByRole('textbox').nth(1).click();
  // await page.getByRole('textbox').nth(1).fill(adminImei1);
  // await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  // await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(adminImei2);
  // await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  // await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(adminSerial);
  // await page.getByText('تایید').click();

  // //login to mini admin
  // await page.getByRole('img', { name: 'avatar' }).click();
  // await page.getByText('خروج').click();
  // await page.getByPlaceholder('نام کاربری').fill(miniAdminName);
  // await page.getByPlaceholder('نام کاربری').press('Tab');
  // await page.getByPlaceholder('رمزعبور').fill('pass@123');
  // await page.getByPlaceholder('رمزعبور').press('Enter');

  // //add previous imei to miniadmin  -> should not add
  // await page.getByRole('link', { name: 'نصب فورگ' }).click();
  // await page.getByRole('button', { name: 'افزودن' }).click();
  // await page.getByRole('textbox').nth(1).click();
  // await page.getByRole('textbox').nth(1).fill(adminImei1);
  // await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  // await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(adminImei2);
  // await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  // await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(adminSerial);
  // await page.getByText('تایید').click();
  // await expect(page.locator('body')).toContainText('مقادیر وارد شده تکراری هستند (Code: 30)');
  // await page.getByRole('cell', { name: `${adminImei2} 15 /` }).getByRole('textbox').click();
  // await page.getByRole('cell', { name: `${adminImei2} 15 /` }).getByRole('textbox').fill(adminNewImei2);
  // await page.getByText('تایید').click();
  // //add new imei to mini admin
  // await expect(page.locator('tbody')).toContainText(adminImei1);
  // await expect(page.locator('tbody')).toContainText(adminNewImei2);
  // await expect(page.locator('tbody')).toContainText(adminSerial);

  // //edit row to row existed
  // const rowC = await page.locator('tbody tr').count();
  // await page.getByRole('row', { name: `${rowC-1} ${adminImei1}` }).locator('a').first().click();
  // await page.getByRole('cell', { name: `${adminNewImei2} 15 /` }).getByRole('textbox').click();
  // await page.getByRole('cell', { name: `${adminNewImei2} 15 /` }).getByRole('textbox').fill(adminImei2);
  // await page.getByText('تایید').click();
  // await expect(page.locator('body')).toContainText('مقادیر وارد شده تکراری هستند (Code: 30)');
  // await page.getByText('تایید').click();

  // //super admin can edit or delete mini admin row
  // //login to super admin
  // await page.getByRole('img', { name: 'avatar' }).click();
  // await page.getByText('خروج').click();
  // await page.getByPlaceholder('نام کاربری').fill(superAdminName);
  // await page.getByPlaceholder('نام کاربری').press('Tab');
  // await page.getByPlaceholder('رمزعبور').fill(superAdminPass);
  // await page.getByPlaceholder('رمزعبور').press('Enter');
  // await page.getByRole('link', { name: 'نصب فورگ' }).click();

  // await page.locator('body').press('ControlOrMeta+Shift+R');//refresh page

  // //find mini admin row in super admin page, edit it and check edited row in mini admin page.
  // const rows = await page.locator('tbody tr');
  // const rowCount = await rows.count();
  // console.log('rowCount: ', rowCount);
  // for(let i=rowCount-1; i >= 1; i--){
  //   const row = rows.nth(i);
  //   console.log('row: ', row);
  //   const imei2 = await row.locator('td').nth(4).innerText();
  //   const adminName = await row.locator('td').nth(6).innerText();
  //   console.log('imei2: ', imei2);
  //   console.log('adminName: ', adminName);
  //   if(imei2 === adminNewImei2 && adminName === miniAdminName) {
  //     console.log('mini admin row exists in super admin page');
  //     await page.getByRole('row', { name: `${i} ${adminImei1}` }).locator('a').first().click();
  //     await page.getByRole('cell', { name: `${adminSerial} 5 /` }).locator('span').first().click();
  //     await page.getByRole('cell', { name: `${adminSerial} 5 /` }).getByRole('textbox').fill(adminNewSerial);
  //     await page.getByRole('cell', { name: `${adminImei1} 15 /` }).getByRole('textbox').click();
  //     await page.getByRole('cell', { name: `${adminImei1} 15 /` }).getByRole('textbox').fill(adminNewImei1);
  //     await page.getByText('تایید').click();

  //     //login to miniadmin
  //     await
  //      page.getByRole('img', { name: 'avatar' }).click();
  //     await page.getByText('خروج').click();
  //     login(page, miniAdminName, 'pass@123');
  //     await page.getByRole('link', { name: 'نصب فورگ' }).click();
  //     //check edited row in super admin is here correctly
  //     const miniRows = await page.locator('tbody tr');
  //     const miniRowsCount = await miniRows.count();
  //     for(let j=miniRowsCount-1; j>=1; j--){
  //       const miniRow = miniRows.nth(j);
  //       const miniImei1 = await miniRow.locator('td').nth(3).innerText();
  //       const miniImei2 = await miniRow.locator('td').nth(4).innerText();
  //       const miniSerial = await miniRow.locator('td').nth(5).innerText();
  //       if(miniImei1 === adminNewImei1 && miniImei2 === adminNewImei2 && miniSerial === adminNewSerial){
  //         console.log('edit mini admin row in super admin page is successfully done');
  //         //lo ut, login to super admin, delete mini admin row, check deleted in mini admin
  //         await page.getByRole('img', { name: 'avatar' }).click();
  //         await page.getByText('خروج').click();
  //         login(page, superAdminName, 'admin@123');
  //         await page.getByRole('link', { name: 'نصب فورگ' }).click();
  //         //find miniadmin row in super admin
  //         const superRows = await page.locator('tbody tr');
  //         const superRowsCount = await superRows.count();
  //         for(let k=superRowsCount-1; k>=1; k--){
  //           const superRow = superRows.nth(k);
  //           const findMiniImei1 = await superRow.locator('td').nth(3).innerText();
  //           const findMiniImei2 = await superRow.locator('td').nth(4).innerText();
  //           const findMiniSerial = await superRow.locator('td').nth(5).innerText();
  //           const rowNum = await superRow.locator('td').nth(1).innerText();
  //           if(findMiniImei1 === adminNewImei1 && findMiniImei2 === adminNewImei2 && findMiniSerial === adminNewSerial){
  //             console.log('find mini admin row in super admin page');
  //             //now i should delete findmini rows in super admin then check it is deleted in mini admin
  //             await page.getByRole('row', { name: `${rowNum} ${adminNewImei1}` }).locator('a').nth(1).click();
  //             await page.getByRole('button', { name: 'تایید' }).click();
  //             await page.getByRole('img', { name: 'avatar' }).click();
  //             await page.getByText('خروج').click();
  //             login(page, miniAdminName, 'admin@123');
  //             await page.getByRole('link', { name: 'نصب فورگ' }).click();
  //             //check deleted row in super admin not exist here.
  //             const miniAdminRows = await page.locator('tbody tr');
  //             const miniAdminRowsCount = await miniAdminRows.count();
  //             for(let m=miniAdminRowsCount-1; m>=1; m--){
  //               const miniAdminRow = miniAdminRows.nth(m);
  //               const findMiniAdminImei1 = await miniAdminRow.locator('td').nth(3).innerText();
  //               const findMiniAdminImei2 = await miniAdminRow.locator('td').nth(4).innerText();
  //               const findMiniAdminSerial = await miniAdminRow.locator('td').nth(5).innerText();
  //               if(findMiniAdminImei1 === adminNewImei1 && findMiniAdminImei2 === adminNewImei2 && findMiniAdminSerial === adminNewSerial){
  //                   console.log('failed test');
  //                   break;
  //               }
  //             }
  //             break;
  //           }
  //         }
  //         break;
  //       }
  //     }
  //     // console.log('edited row in super admin page not found. error')
  //     // break;
  //   }
  // }

})


