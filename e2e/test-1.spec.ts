// @ts-check
import { test, expect } from '@playwright/test';

function generateRandomString(length, type) {
  let characters='0123456789';
  if (type === 'serial'){
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  if (type === 'name'){
    characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  }
  let result = '';
  for(let i=0; i< length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getRandomNumber(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

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


async function login(page, user, password) {
  await page.goto('http://192.168.136.90/');
  await page.goto('http://192.168.136.90/user/login');
  await page.goto('http://192.168.136.90/user/login/');
  await page.getByPlaceholder('نام کاربری').fill(user);
  await page.getByPlaceholder('نام کاربری').press('Tab');
  await page.getByPlaceholder('رمزعبور').fill(password);
  await page.getByPlaceholder('رمزعبور').press('Tab');
  await page.getByRole('button', { name: 'ورود' }).press('Enter');
}


test('test_release', async ({ page }) => {
  await login(page, superAdminName, superAdminPass);
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  //find table row count
  await page.locator('tr').first().waitFor();
  let rowCount = await page.locator('tbody tr').count();
  console.log('rowCount: ', rowCount);
  //add correctly - start
  await page.getByRole('button', { name: 'افزودن' }).click();
  await expect(page.getByRole('button', { name: 'افزودن' })).toBeDisabled();//disable add button
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(randomImei1);
  await page.getByRole('textbox').nth(1).press('Tab');
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(randomImei2);
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(randomSerial);
  await expect(page.getByRole('row', { name: `${rowCount} ${randomImei1}` }).getByLabel('')).toBeDisabled();
  await page.getByText('تایید').click();
  //check admin
  const locator1 = page.locator('span.name___WfKAK.anticon');
  const headerText = await locator1.textContent();
  await expect(page.locator('tbody')).toContainText(`${headerText}`);
  //check date ?????
  // const date = new Date();
  // await expect(page.locator('tbody')).toContainText('1403/03/01');
  await expect(page.locator('tbody')).toContainText(randomImei1);
  await expect(page.locator('tbody')).toContainText(randomImei2);
  await expect(page.locator('tbody')).toContainText(randomSerial);
  //cancel in add and edit
  await page.getByRole('row', { name: `${rowCount} ${randomImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').fill('DKFIRERTt');
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').fill('000222111111111');
  await page.getByRole('cell', { name: `${randomImei1} 15 /` }).getByRole('textbox').fill('000999966999999');
  await page.getByText('لغو').click();
  await expect(page.locator('tbody')).toContainText(randomImei1);//before last line
  await expect(page.locator('tbody')).toContainText(randomImei2);
  await expect(page.locator('tbody')).toContainText(randomSerial);
  //cancel in add - start
  await page.getByRole('button', { name: 'افزودن' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(imei1);
  await page.getByText('لغو').click();
  await expect(page.locator('tbody').getByText(imei1)).not.toBeVisible();
  //ok in add ...
  await page.getByRole('button', { name: 'افزودن' }).click();
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(imei1);
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill('d');
  await expect(page.locator('body')).toContainText('imei نامعتبر');
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill('ث');
  await expect(page.locator('body')).toContainText('imei نامعتبر');
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill('ی');
  await expect(page.locator('body')).toContainText('زبان صفحه کلید خود را به انگلیسی تغییر دهید');
  await page.getByRole('cell', { name: '15 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '15 / 15' }).getByRole('textbox').fill(randomImei1);
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(randomImei2);
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 50' }).getByRole('textbox').fill(randomSerial);
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('مقادیر وارد شده تکراری هستند (Code: 30)');
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').fill(newSerial);
  await page.getByText('تایید').click();
  await expect(page.locator('tbody')).toContainText(randomImei1);
  await expect(page.locator('tbody')).toContainText(randomImei2);
  await expect(page.locator('tbody')).toContainText(newSerial);
  console.log('randomImei1: ', randomImei1);
  //edit
  await page.locator('tr').first().waitFor();
  rowCount = await page.locator('tbody tr').count();
  console.log('rowCount: ', rowCount);
  await page.getByRole('row', { name: `${rowCount-1} ${randomImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${newSerial} 5 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${newSerial} 5 /` }).getByRole('textbox').fill(randomSerial);
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('مقادیر وارد شده تکراری هستند (Code: 30)');
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomImei2} 15 /` }).getByRole('textbox').fill(newImei2);
  await page.getByText('تایید').click();
  await expect(page.locator('tbody')).toContainText(randomImei1);
  await expect(page.locator('tbody')).toContainText(newImei2);
  await expect(page.locator('tbody')).toContainText(randomSerial);
  await page.getByRole('row', { name: `${rowCount-1} ${randomImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${randomSerial} 5 /` }).getByRole('textbox').fill('');
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(randomSerial);
  await page.getByRole('cell', { name: `${newImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${newImei2} 15 /` }).getByRole('textbox').fill('');
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('لطفا مقادیر خواسته شده را وارد کنید');
  await page.getByText('لغو').click();
  await expect(page.locator('tbody')).toContainText(randomImei1);//last line
  await expect(page.locator('tbody')).toContainText(newImei2);
  await expect(page.locator('tbody')).toContainText(randomSerial);
  //delete
  await page.getByRole('row', { name: `${rowCount-1} ${randomImei1}` }).locator('a').nth(1).click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.locator('body')).toContainText('تغییرات با موفقیت اعمال شد');
  await expect(page.locator('tbody').getByText(newImei2)).not.toBeVisible();
  await page.getByRole('row', { name: `${rowCount-2} ${randomImei1}` }).getByLabel('').check();
  await page.getByRole('button', { name: 'delete حذف' }).click();
  await expect(page.locator('body')).toContainText('تغییرات با موفقیت اعمال شد');
  await expect(page.locator('tbody').getByText(randomImei2)).not.toBeVisible();;
  //not delete released - test released
  //same 2 rows in 2 mini admin - test same 2 rows in 2 admins
  
});

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
  
  const licenseName = generateRandomString(5, 'name');
  let licenseCapacity = getRandomNumber(3, 9).toString();
  const miniAdminName = generateRandomString(5, 'name');
  
  console.log('licenseName: ', licenseName)
  console.log('licenseCapacity: ', licenseCapacity)
  console.log('miniAdminName: ', miniAdminName)
  

  //create new license
  await page.getByRole('link', { name: 'مجوزها' }).click();
  await page.getByRole('button', { name: 'plus مجوز جدید' }).click();
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill(licenseName);
  await page.getByLabel('نام').press('Tab');
  await page.getByLabel('ظرفیت').fill(licenseCapacity);
  await page.getByLabel('ظرفیت').press('Tab');
  await page.getByLabel('توضیحات').press('Tab');
  await page.getByRole('button', { name: 'لغو' }).press('Tab');
  await page.getByRole('button', { name: 'تایید' }).press('Enter');
  console.log('licenseName2: ', licenseName);
  await expect(page.getByRole('rowgroup')).toContainText(licenseName); // if the license page is full maybe this line has error.
  await expect(page.getByRole('rowgroup')).toContainText(licenseCapacity);

  //create new mini admin and bind it to license
  await page.getByRole('link', { name: 'مدیران' }).click();
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.getByLabel('نام کاربری').click();
  await page.getByLabel('نام کاربری').fill(miniAdminName);
  await page.getByLabel('نام کاربری').press('Tab');
  await page.getByLabel('رمزعبور').fill('pass@123');
  await page.getByLabel('مجوز').click();
  await page.getByText(licenseName).click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.getByRole('rowgroup')).toContainText(miniAdminName);
  await expect(page.getByRole('rowgroup')).toContainText(licenseName);

  //add imei in super admin
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  await page.getByRole('button', { name: 'افزودن' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(adminImei1);
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(adminImei2);
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(adminSerial);
  await page.getByText('تایید').click();

  //login to mini admin
  await page.getByRole('img', { name: 'avatar' }).click();
  await page.getByText('خروج').click();
  await page.getByPlaceholder('نام کاربری').fill(miniAdminName);
  await page.getByPlaceholder('نام کاربری').press('Tab');
  await page.getByPlaceholder('رمزعبور').fill('pass@123');
  await page.getByPlaceholder('رمزعبور').press('Enter');

  //add previous imei to miniadmin  -> should not add
  await page.getByRole('link', { name: 'نصب فورگ' }).click();
  await page.getByRole('button', { name: 'افزودن' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(adminImei1);
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0 / 15' }).getByRole('textbox').fill(adminImei2);
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '/ 50' }).getByRole('textbox').fill(adminSerial);
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('مقادیر وارد شده تکراری هستند (Code: 30)');
  await page.getByRole('cell', { name: `${adminImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${adminImei2} 15 /` }).getByRole('textbox').fill(adminNewImei2);
  await page.getByText('تایید').click();
  //add new imei to mini admin
  await expect(page.locator('tbody')).toContainText(adminImei1);
  await expect(page.locator('tbody')).toContainText(adminNewImei2);
  await expect(page.locator('tbody')).toContainText(adminSerial);

  //edit row to row existed
  const rowC = await page.locator('tbody tr').count();
  await page.getByRole('row', { name: `${rowC-1} ${adminImei1}` }).locator('a').first().click();
  await page.getByRole('cell', { name: `${adminNewImei2} 15 /` }).getByRole('textbox').click();
  await page.getByRole('cell', { name: `${adminNewImei2} 15 /` }).getByRole('textbox').fill(adminImei2);
  await page.getByText('تایید').click();
  await expect(page.locator('body')).toContainText('مقادیر وارد شده تکراری هستند (Code: 30)');
  await page.getByText('تایید').click();

  //super admin can edit or delete mini admin row
  //login to super admin
  await page.getByRole('img', { name: 'avatar' }).click();
  await page.getByText('خروج').click();
  await page.getByPlaceholder('نام کاربری').fill(superAdminName);
  await page.getByPlaceholder('نام کاربری').press('Tab');
  await page.getByPlaceholder('رمزعبور').fill(superAdminPass);
  await page.getByPlaceholder('رمزعبور').press('Enter');
  await page.getByRole('link', { name: 'نصب فورگ' }).click();

  await page.locator('body').press('ControlOrMeta+Shift+R');//refresh page

  //find mini admin row in super admin page, edit it and check edited row in mini admin page.
  const rows = await page.locator('tbody tr');
  const rowCount = await rows.count();
  console.log('rowCount: ', rowCount);
  for(let i=rowCount-1; i >= 1; i--){
    const row = rows.nth(i);
    console.log('row: ', row);
    const imei2 = await row.locator('td').nth(4).innerText();
    const adminName = await row.locator('td').nth(6).innerText();
    console.log('imei2: ', imei2);
    console.log('adminName: ', adminName);
    if(imei2 === adminNewImei2 && adminName === miniAdminName) {
      console.log('mini admin row exists in super admin page');
      await page.getByRole('row', { name: `${i} ${adminImei1}` }).locator('a').first().click();
      await page.getByRole('cell', { name: `${adminSerial} 5 /` }).locator('span').first().click();
      await page.getByRole('cell', { name: `${adminSerial} 5 /` }).getByRole('textbox').fill(adminNewSerial);
      await page.getByRole('cell', { name: `${adminImei1} 15 /` }).getByRole('textbox').click();
      await page.getByRole('cell', { name: `${adminImei1} 15 /` }).getByRole('textbox').fill(adminNewImei1);
      await page.getByText('تایید').click();

      //login to miniadmin
      await page.getByRole('img', { name: 'avatar' }).click();
      await page.getByText('خروج').click();
      // await page.getByPlaceholder('نام کاربری').click();
      // await page.getByPlaceholder('نام کاربری').fill(miniAdminName);
      // await page.getByPlaceholder('رمزعبور').click();
      // await page.getByPlaceholder('رمزعبور').fill('pass@123');
      // await page.getByPlaceholder('رمزعبور').press('Enter');
      login(page, miniAdminName, 'pass@123');
      await page.getByRole('link', { name: 'نصب فورگ' }).click();
      //check edited row in super admin is here correctly
      const miniRows = await page.locator('tbody tr');
      const miniRowsCount = await miniRows.count();
      for(let j=miniRowsCount-1; j>=1; j--){
        const miniRow = miniRows.nth(j);
        const miniImei1 = await miniRow.locator('td').nth(3).innerText();
        const miniImei2 = await miniRow.locator('td').nth(4).innerText();
        const miniSerial = await miniRow.locator('td').nth(5).innerText();
        if(miniImei1 === adminNewImei1 && miniImei2 === adminNewImei2 && miniSerial === adminNewSerial){
          console.log('edit mini admin row in super admin page is successfully done');
          //logout, login to super admin, delete mini admin row, check deleted in mini admin
          await page.getByRole('img', { name: 'avatar' }).click();
          await page.getByText('خروج').click();
          login(page, superAdminName, 'admin@123');
          await page.getByRole('link', { name: 'نصب فورگ' }).click();
          //find miniadmin row in super admin
          const superRows = await page.locator('tbody tr');
          const superRowsCount = await superRows.count();
          for(let k=superRowsCount-1; k>=1; k--){
            const superRow = superRows.nth(k);
            const findMiniImei1 = await superRow.locator('td').nth(3).innerText();
            const findMiniImei2 = await superRow.locator('td').nth(4).innerText();
            const findMiniSerial = await superRow.locator('td').nth(5).innerText();
            if(findMiniImei1 === adminNewImei1 && findMiniImei2 === adminNewImei2 && findMiniSerial === adminNewSerial){
              //now i should delete findmini rows in super admin then check it is deleted in mini admin

              

            }
          }
          break;
        }
      }
      console.log('edited row in super admin page not found. error')
      break;
    }
  }
  console.log('mini admin release row does not exist in super admin page. error');
})
