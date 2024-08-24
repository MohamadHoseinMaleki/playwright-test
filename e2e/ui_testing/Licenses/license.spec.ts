import { test, expect, Page } from '@playwright/test';
import { generateUnauthorizeNames, search } from "../Groups/group_func";
import { generatePassword, generateRandomString, getRandomNumber, load, login, waitForMessage, waitForToastMessage } from "../general/general";
import { create_license, delete_license, edit_license, find_license_row } from './license_func';
import { create_miniadmin, deleteAdmin } from '../Admins/admins_func';
import { getJWT } from '../../api_testing/general';

const superAdminName = 'admin';
const superAdminPass = 'admin@123';
const AdName=generateRandomString(5,'imei');
const AdName2=generateRandomString(5,'imei');
const AdPass = generatePassword();
const license = {
    name: generateRandomString(5, 'name'),
    capacity: getRandomNumber(3, 9).toString(),
};
const license2 = {
    name: generateRandomString(5, 'name'),
    capacity: getRandomNumber(3, 9).toString(),
};  
    
const unauthorizeNamelicense = {
    name: generateUnauthorizeNames(5,'imei'),
    capacity: getRandomNumber(3, 9).toString()};

const emptyfeildLincense = {
    name: generateRandomString(5, 'name'),
    capacity: ''};


const unauthorizeCapacityLincen = {
    name: generateRandomString(5, 'name'),
    capacity: generateRandomString(5,'name'),};
const specialLincense = {
    name: 'pages.license.superAdminLicense',
    capacity: generateRandomString(5,'name'),};

const newName=generateRandomString(5,'name');

let superAdminCapacity : number | null = null;

const overCapacityLicense = {
    name: generateRandomString(5, 'name'),
    // capacity: totalCapacity + 1,
    capacity:'10001',
};
  

test('@license_ test1', async ({ page }) => {
    //@license_ test1-1
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    
    // search(page,'مدیرکل');
    // const element = await page.locator('div.td > span', { hasText: '1000' });
    // const textContent = await element.textContent();
    // superAdminCapacity = textContent ? parseInt(textContent.trim(), 10) : null;
    // console.log(`modir kol capacity: ${superAdminCapacity}`);
 
    await create_license(page,license);
    await search(page,license.name);
    const isPresent = await page.isVisible(`text=${license.name}`);
    expect(isPresent);
    console.log('add license '+{license} +'is sucess');

    // duplicate name     @license_ test1-2
    await create_license(page,license);
    await waitForToastMessage(page,'تغییرات موردنظر اعمال نشد (Code: 23)');
    /* const isT = page.getByText('تغییرات موردنظر اعمال نشد (Code: 23)');
    expect(isT).toBeTruthy; */
    await page.getByRole('button', { name: 'لغو' }).click();
    
    // unauthorizeName    @license_ test1-3
    await create_license(page,unauthorizeNamelicense);
    await search(page,unauthorizeNamelicense.name);
    const isTrue = await page.isVisible(`text=${unauthorizeNamelicense.name}`);
    expect(isTrue);

    // empty field       @license_ test1-4
    await create_license(page,emptyfeildLincense);
    const error = page.getByText('فیلد ظرفیت اجباریست');
    expect(error).toBeTruthy;
    await page.getByText('لغو').click();

    // overCapacity of modir kol

    // await search(page, 'مدیر کل');
    // const row = page.getByRole('row', { name: /مدیر کل/ });
    // const capacityElement = row.locator('td').nth(3); 

    // const capacityText = await capacityElement.textContent();
    // const totalCapacity = parseInt(capacityText || '0', 10); 
    await create_license(page, overCapacityLicense);

    const e4 = page.getByText('محدودیت ظرفیت مجوز');
    await expect(e4).toBeVisible();
    await page.getByText('لغو').click();

    // unauthorize Capacity  @license_ test1-5
    await create_license(page,unauthorizeCapacityLincen);
    const e = page.getByText('ظرفیت مجوز نامعتبر');
    expect(e).toBeTruthy;
    await page.getByText('لغو').click();
    // with special name    @license_ test1-5
    await create_license(page,specialLincense);
    // await waitForToastMessage(page,'تغییرات موردنظر اعمال نشد (Code: 43)');

    const Error = page.getByText('تغییرات موردنظر اعمال نشد (Code: 43)');
    expect(Error).toBeTruthy;
    await page.getByText('لغو').click();
})


test('@license_ test2', async ({ page }) => {
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await search(page,license.name);
    const isPresent = await page.isVisible(`text=${license.name}`);
    expect(isPresent); 
})


test('@license_ test3 ', async ({ page }) => {
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await edit_license(page,unauthorizeNamelicense.name ,newName);
    search(page,newName);
    const isPresent = await page.isVisible(`text=${newName}`);
    expect(isPresent);
    console.log('edit license '+{unauthorizeNamelicense} +'is sucess new name :'+{newName});

    // edit with duplicate name     @license_ test3-1
    await edit_license(page,newName ,license.name);
    await waitForToastMessage(page,'تغییرات موردنظر اعمال نشد (Code: 23)');
    // const isT = page.getByText('تغییرات موردنظر اعمال نشد (Code: 23)');
    // expect(isT).toBeTruthy;
    await page.getByText('لغو').click();

    // edit empty field      @license_ test3-2
    await edit_license(page,newName , emptyfeildLincense.capacity);
    await waitForToastMessage(page,'تغییرات موردنظر اعمال نشد (Code: 23)');
    // const error = page.getByText('تغییرات موردنظر اعمال نشد (Code: 23)');
    // expect(error).toBeTruthy;
    await page.getByText('لغو').click();
})

 
test('@license_ test4', async ({ page }) => {
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    // await find_license_row(page,license);

    //do not delete super admin license     @license_ test5-1
    await search(page, 'مدیر کل');
    const totalCapacity = page.getByRole('cell', { name: '1000' }).locator('span');
    const checkboxLocator =  page.getByRole('row', { name: 'مدیر کل 1000' }).locator('label span').nth(1)
    const isDisabled = await checkboxLocator.isDisabled();
    expect(isDisabled).toBe(true);
    
    //delete one   @license_ test4-1
    await delete_license(page,newName);

    //delete grouply no one use     @license_ test4-2
    await create_license(page,license2);
    await page.getByPlaceholder('جستجو کنید').fill('');
    await page.getByRole('row', { name: license.name  }).getByLabel('').click();
    await page.getByRole('row', { name: license2.name  }).getByLabel('').click();
    await page.getByRole('button', { name: 'delete حذف' }).click();
    await waitForToastMessage(page,'تغییرات موردنظر اعمال شد');
    // const ok =page.getByText('تغییرات با موفقیت اعمال شد'); 
    // expect(ok);
    await search(page,license.name);
    await expect(page.getByRole('row', { name: license.name })).toBeHidden();
    await search(page,license2.name);
    await expect(page.getByRole('row', { name: license2.name })).toBeHidden();

    //delete grouply just one use      @license_ test4-3
    await create_license(page,license);
    await create_license(page,license2);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await create_miniadmin(page,AdName,AdPass,license.name);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await page.getByRole('row', { name: license.name  }).getByLabel('').click();
    await page.getByRole('row', { name: license2.name  }).getByLabel('').click();
    await page.getByRole('button', { name: 'delete حذف' }).click()
    const e =page.getByText('مجوز در جای دیگری استفاده شده است'); 
    await page.getByRole('button', { name: 'تایید' }).click();
    expect(e);
    //check
    await search(page,license.name);
    const isPresent = await page.isVisible(`text=${license.name}`);
    expect(isPresent);
    await search(page,license2.name);
    await expect(page.getByRole('row', { name: license2.name })).toBeHidden();

    //delete grouply all use        @license_ test4-4
    await create_license(page,license2);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await create_miniadmin(page,AdName2,AdPass,license2.name);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await page.getByRole('row', { name: license.name  }).getByLabel('').click();
    await page.getByRole('row', { name: license2.name  }).getByLabel('').click();
    await page.getByRole('button', { name: 'delete حذف' }).click()
    const message =page.getByText('مجوز در جای دیگری استفاده شده است'); 
    await page.getByRole('button', { name: 'تایید' }).click();
    expect(message);
    //check
    await search(page,license.name);
    const isHere = await page.isVisible(`text=${license.name}`);
    expect(isHere);
});


test('clear footstep ', async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await deleteAdmin(page,AdName);
    await deleteAdmin(page,AdName2);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await delete_license(page,license.name);
    await delete_license(page,license2.name);
})

//@license_ test5-3
test('API test', async ({ request }) => {
   const jwtToken =  await getJWT(request);

   const url = 'http://192.168.136.90/back-api/license';
   const requestData = {
       capacity:"600",
       description:"",
       id:"1",
       name:" کل",
   };

   const response = await request.put(url, {
       data: requestData,
       headers: {
           'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
       }
   });

   expect(response.status()).toBeGreaterThanOrEqual(200);
   expect(response.status()).toBeLessThan(500);

   const responseBody = await response.json();
      
    expect(responseBody).toHaveProperty('message', 'update license failed');
    expect(responseBody).toHaveProperty('payload');
    expect(responseBody.payload).toHaveProperty('toast', 'api.error.mutation');
    expect(responseBody).toHaveProperty('result', 43);

    expect(responseBody).not.toHaveProperty('success');
})