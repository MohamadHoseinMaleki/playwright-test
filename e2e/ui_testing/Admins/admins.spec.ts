import { test, expect } from '@playwright/test';
import { generateRandomString, login,generatePassword, generateWrongPass, waitForMessage, generateNationalId, generatePhoneNum, getRandomNumber, load, waitForToastMessage, exit } from '../general/general';
import { add_miniad, add_miniadmin, adminAccess, changePass, create_ad, create_miniad, create_miniadmin, deleteAdmin, editAdminFields, editAdminLincens } from './admins_func';
import { search ,check, fillGroupForm, dele} from '../Groups/group_func';
import { create_license, delete_license, edit_license } from '../Licenses/license_func';

const superAdminName = 'admin';
const superAdminPass = 'admin@123';

const AdName=generateRandomString(5,'imei');
const specialName= 'or 40<57;';
const AdPass = generatePassword();
const wrongPass = generateWrongPass();
const newpass = generatePassword();
const license = {
    name: generateRandomString(5, 'name'),
    capacity: getRandomNumber(3, 9).toString(),
  }
const newlinsenceName= '13eaj';
const overCharacter=generateRandomString(52,'imei') ;
const fname=generateRandomString(4,'serial');
const family=generateRandomString(4,'serial');
const Nid= generateNationalId(8);
const pCode=getRandomNumber(4,5) ;
const num=generatePhoneNum(8);
const phoneNum=generatePhoneNum(8);
const company =generateRandomString(5,'imei') ;
const room= generateRandomString(5,'serial') ;
const describ= generateRandomString(6,'serial');
const newfname=generateRandomString(4,'serial');
const newfamily=generateRandomString(4,'serial');
const newNid= generateNationalId(8);
const newpCode=generateRandomString(4,5) ;
const newnum=generatePhoneNum(8);
const newphoneNum=generatePhoneNum(8);
const newcompany =generateRandomString(5,'imei') ;
const newroom= generateRandomString(5,'serial') ;
const newdescrib= generateRandomString(6,'serial');
const newlinsence ='e3eaj';
const groupName = generateRandomString(5,'imei');


test('@admin_test1', async ({ page }) => {
    //add admin by true info    @admin_test1-1
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await create_license(page, license);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await create_miniadmin(page,AdName,AdPass,license.name);
    await search(page,AdName);
    const isPresent = await page.isVisible(`text=${AdName}`);
    expect(isPresent);
    // fill special charakter    @admin_test1-3
    await add_miniadmin(page,specialName,AdPass,license.name,fname,family,Nid,pCode,num,phoneNum,company,room,describ);
    await search(page,specialName);
    const isTrue = await page.isVisible(`text=${specialName}`);
    expect(isTrue);
    // try wrong pass use space    @admin_test1-4
    await create_miniad(page,AdName,wrongPass,license);
    await page.getByText('رمز عبور باید حداقل 8');
    await page.getByText('لغو').click();
    //overCharacter for input     @admin_test1-5
    await add_miniad(page,overCharacter,overCharacter);
    await page.getByText('تعداد کاراکترهای وارد شده بیش از حد مجاز است');
    await page.getByText('لغو').click();
    //add duplicate name admin    @admin_test1-8
    await create_ad(page,AdName,AdPass);
    await waitForToastMessage(page,'نام کاربری تکراری است (Code: 6)');
    // const isT = page.getByText('نام کاربری تکراری است (Code: 6)');
    // expect(isT).toBeTruthy;
    await page.getByText('لغو').click();
    // empty license    @admin_test1-9
    await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.getByLabel('نام کاربری').click();
    await page.getByLabel('نام کاربری').fill(AdName);
    await page.getByLabel('رمزعبور').waitFor({state: 'visible'});
    await page.getByLabel('رمزعبور').click();
    await page.getByLabel('رمزعبور').fill(AdPass);
    await page.getByRole('button', { name: 'تایید' }).click();

    await page.getByText('فیلد مجوز اجباریست');
    const erro = await page.isVisible('فیلد مجوز اجباریست');
    expect(erro);

})


test ('@admin_test2', async ({ page }) => {
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    // await add_miniadmin(page,specialName,AdPass,license,fname,family,Nid,pCode,num,phoneNum,company,room,describ);
    await search(page,specialName);
    const tr =await page.getByRole('cell', { name: AdName }).locator('span');
    expect(tr);
    //search license column
    await search(page,license.name);
    await page.getByRole('cell',license).locator('span');
    //search firstname column
    await search(page,fname);
    await page.getByText(fname).first();
    //search family name column
    await search(page,family);
    const t =page.getByText(family).first();
    expect(t);
})


test ('@admin_test3', async ({ page }) => {
    //edit license and checking    @admin_test3-1
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    // await create_license(page, license);
    await edit_license(page,license.name,newlinsenceName);
    await search(page,newlinsenceName);
    await page.getByRole('cell', { name: newlinsenceName });
    
    //edit admin license       @admin_test3-2
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await search(page,AdName);
    await page.getByRole('cell', { name: newlinsenceName }).locator('span');
    await editAdminLincens(page,AdName,newlinsenceName,newlinsence);
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
    // const ok =page.getByText('تغییرات با موفقیت اعمال شد'); 
    // expect(ok);
    await search(page,AdName);
    await page.getByRole('row', { name: AdName }).locator('a').nth(2).click();
    // await page.getByRole('cell', { name: newlinsence });
    const isTrue = await page.getByRole('cell', { name: newlinsence });
    expect(isTrue);
    await page.getByText('لغو').click();
})


test('@admin_test4 ', async({page})=>{
    //Change group access and checking      @admin_test4-2 
    await login(page,superAdminName,superAdminPass);
    await fillGroupForm(page, groupName);
    await search(page,groupName);
    const isPresent = await page.isVisible(`text=${groupName}`);
    expect(isPresent);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await adminAccess(page,AdName,groupName);
    // await page.getByText('تغییرات با موفقیت اعمال شد'); 
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
    // await page.waitForTimeout(200);

    //login with  miniadmin   
    // await page.locator('span').filter({ hasText: 'admin' }).first().click();
    // await page.getByRole('menuitem', { name: 'logout خروج' }).click();
    // // await page.waitForSelector('span:has-text("خروج")');
    await exit(page,'admin');
    await login(page,AdName,AdPass);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await search(page,groupName);
    const isTrue = page.getByRole('cell', { name: groupName });
    expect(isTrue);

    //Check login with new password    @admin_test4-3
    await exit(page,AdName);
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await changePass(page,AdName,await newpass);
    // await page.locator('span').filter({ hasText: 'admin' }).first().hover();
    // await page.locator('span').filter({ hasText: 'admin' }).first().click();
    // await page.waitForSelector('ul.ant-dropdown-menu');
    // // await page.waitForTimeout(100); //static time because from front
    // await page.getByRole('menuitem', { name: 'logout خروج' }).click();
    await exit(page,'admin');
    await login(page,AdName,newpass);
    expect(page).toHaveURL('http://192.168.136.90/config-device');
 
    // edit Admin Fields    @admin_test4-4 
    await exit(page,AdName);
    await login(page,superAdminName,superAdminPass);
    await page.waitForTimeout(300);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page);
    await editAdminFields(page,AdName,newfname,newfamily,newNid,newpCode,newnum,newphoneNum,newcompany,newroom,newdescrib);

    // delete admin      @admin_test4-5
    await deleteAdmin(page,AdName);    
})


test('clear foot step',async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await page.getByRole('link', { name: 'مدیران' }).click();
    await load(page); 
    await deleteAdmin(page,specialName);
    await page.getByRole('link', { name: 'مجوزها' }).click();
    await load(page);
    await delete_license(page,newlinsenceName);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await dele(page,groupName);
})