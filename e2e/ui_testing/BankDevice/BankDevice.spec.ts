import { expect, test, Page } from "@playwright/test";
import { search } from "../Groups/group_func";
import { generateRandomString, load, login, waitForToastMessage } from "../general/general";
import { create_Bankdevice, delete_device, edit_device } from "./BankDevice_func";

const superAdminName = 'admin';
const superAdminPass = 'admin@123';

const deviceName =generateRandomString(5,'serial');


test('@Bank_test1', async ({ page }) => {
    //add     @Bank_test1-1
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'بانک دستگاه' }).click();
    await load(page);
    // await create_Bankdevice();
    // await search(page,license.name);
    // const isPresent = await page.isVisible(`text=${license.name}`);
    // expect(isPresent);
    // console.log('add license '+{license} +'is sucess');


    // fill special charakter    @admin_test1-3
    // await create_Bankdevice();
    // await search(page,unauthorizeNamelicense.name);
    // const isTrue = await page.isVisible(`text=${unauthorizeNamelicense.name}`);
    // expect(isTrue);
    
    // // unauthorizeName    @Bank_ test1-3
    // await create_Bankdevice(page,unauthorizeNamelicense);
    // await search(page,unauthorizeNamelicense.name);
    // const isTrue = await page.isVisible(`text=${unauthorizeNamelicense.name}`);
    // expect(isTrue);

    // // empty field       @Bank_ test1-4
    // await create_Bankdevice(page,emptyfeildLincense);
    // const error = page.getByText('فیلد ظرفیت اجباریست');
    // expect(error).toBeTruthy;
    // await page.getByText('لغو').click();
    
// // duplicate name     @Bank_ test1-2
    // await create_Bankdevice(page,license);
    // await waitForToastMessage(page,'تغییرات موردنظر اعمال نشد (Code: 23)');
    // /* const isT = page.getByText('تغییرات موردنظر اعمال نشد (Code: 23)');
    // expect(isT).toBeTruthy; */
    // await page.getByRole('button', { name: 'لغو' }).click();
    
    
});



test('@Bank_ test2', async ({ page }) => {
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'بانک دستگاه' }).click();
    await load(page);
    await search(page,deviceName);
    const isPresent = await page.isVisible(`text=${deviceName}`);
    expect(isPresent); 

    await search(page,deviceModel);
    const isTrue = await page.isVisible(`text=${deviceName}`);
    expect(isPresent);

    
});


test('@bank_test3',async ({page})=>{
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'بانک دستگاه' }).click();
    await edit_device();
    await page.getByRole('link', { name: 'پیکربندی دستگاه' }).click();
    await search(page,newname);

});


test('@bank_test4', async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'بانک دستگاه' }).click();
    await delete_device();
    
});