// @ts-check
import { test, expect, Page, devices } from '@playwright/test';
import {generateRandomString, login, getRandomNumber, generateNationalId, generatePhoneNum, load, waitForToastMessage} from '../general/general';
import { fillGroupForm, generateUnauthorizeNames,fillSubGroupForm, search, fillDeviceForm, check, dele} from './group_func';
import {  getRandomId , addUser} from '../Device configuration/DeviceConfig_func';

const superAdminName = 'admin';
const superAdminPass = 'admin@123';

const groupName = generateRandomString(5,'imei');
const newNamegroup= generateRandomString(5,'imei');

const subgroupName = generateRandomString(5, 'serial');
const newsubgroupName = generateRandomString(5, 'serial');

const unauthorizeName =generateUnauthorizeNames(5,'imei');
const unauthorizesubName =generateUnauthorizeNames(5,'imei');

const withoutToast = 'withoutToast';

const name= generateRandomString(4,'serial');
const family=generateRandomString(4,'serial');
const Nid= generateNationalId(8);
const pCode=getRandomNumber(5,5) ;
const number=generatePhoneNum(8);
const phoneNum=generatePhoneNum(8);
const company =generateRandomString(5,'imei') ;
const room= generateRandomString(5,'serial') ;
const describ= generateRandomString(6,'serial');
const pass = getRandomId(8);
const idKarbar=generateRandomString(5,'imei')

test.describe.serial('group', () => {
  
//add new group and verify  @group_ test1-1
test('Add new group and verify', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await fillGroupForm(page, groupName);
    await search(page,groupName);
    const isPresent = await page.isVisible(`text=${groupName}`);
    expect(isPresent);
    console.log('add group'+{groupName}+'is sucess');
  });


//Add  duplicate group @group_ test1-2
  test('Add duplicate group', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await fillGroupForm(page, groupName);
    // const isPresent = await page.getByText(`نام گروه تکراری است (Code: 32)`);
    // expect(isPresent).toBeTruthy;
    await waitForToastMessage(page,`نام گروه تکراری است (Code: 32)`);
    await page.getByRole('button', { name: 'لغو' }).click();
  });


 // Using unauthorized names @group_ test1-3
  test('Using unauthorized names ', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await fillGroupForm(page, unauthorizeName);
    await search(page,unauthorizeName);
    const isPresent = await page.isVisible(`text=${unauthorizeName}`);
    expect(isPresent).toBeTruthy();
  
  });

  //CLEAR FOOT STEP
  test('DELETE unauthorized GROUP ', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    const notAvb= await dele(page,unauthorizeName );
    expect (notAvb);
  });
  

//add subgroup    @group_ test2
  test('Add subgroup', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await search(page,groupName);
    // await page.waitForTimeout(800);
    await fillSubGroupForm(page,subgroupName);
    await page.waitForTimeout(1000);
    await page.getByRole('row', { name: `Toggle Row Expanded 1` }).locator('path').first().click();
    await page.getByRole('cell', { name: subgroupName }).locator('span').click();
    const isPresent = await page.isVisible (`text=${subgroupName}`);
    expect(isPresent).toBeTruthy();
  });


  // duplicate add subgroup   @group_ test2-2
  test('Add duplicate subgroup', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await search(page,groupName);
    await fillSubGroupForm(page,subgroupName);
    // const isPresent = await page.getByText(`نام زیرگروه تکراری است (Code: 34)`);
    // expect(isPresent).toBeTruthy;
    await waitForToastMessage(page,`نام زیرگروه تکراری است (Code: 34)`);
    await page.getByRole('button', { name: 'لغو' }).click();
  });
      
  //Using unauthorized subnames   @group_ test2-3
  test('Using unauthorized subnames ', async ({ page }) => {
    await login(page, superAdminName, superAdminPass);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await search(page,groupName);
    await fillSubGroupForm(page, unauthorizesubName);
    await search(page,unauthorizesubName);
    await page.getByRole('cell', { name: 'Toggle Row Expanded' }).click();
    
    const isPresent = await page.getByRole('cell', { name: 'sdf' }).locator('span');
    expect(isPresent).toBeTruthy();
  });


  //search    @group_ test3
  test('search', async ({ page }) => {
  await login(page, superAdminName, superAdminPass);
  // await fillGroupForm(page, groupName);
  await search (page,groupName);
  const isPresent = await page.isVisible(`text=${groupName}`);
  expect(isPresent);
});

  //edit      @group_ test4
test('edit name general ', async ({ page }) => {
  const deviceData = {
    id: getRandomId(8),
    name: generateRandomString(5, 'imei'),
    group: groupName,
    specification: 'samsung a15 (API 34)'};
  
  await login(page, superAdminName, superAdminPass);
  // await fillGroupForm(page, groupName);
  // await check(page, groupName, withoutToast,)
  await page.getByRole('link', { name: 'گروه ها' }).click();
  
    await page.getByRole('link', { name: 'پیکربندی دستگاه'}).click();
    await load(page);
    await fillDeviceForm(page, deviceData);
    await check(page,deviceData.id,withoutToast);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await search(page ,groupName);
    await page.getByRole('row', { name: 'Toggle Row Expanded 1' }).locator('a').nth(1).click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.getByLabel('نام').fill(newNamegroup);
    await page.getByRole('button', { name: 'تایید' }).click();
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
    await page.getByRole('link', { name: 'پیکربندی دستگاه' }).click();
    await load(page);
    await search(page ,deviceData.id);
    // const isPresent = await page.isVisible(`text=${newNamegroup}`);
    // expect(isPresent);
    await addUser(page,idKarbar,deviceData.id ,subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);

    // await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'گروه ها' }).click();
  await load(page);
  await search(page ,newNamegroup);

  await page.getByTitle('Toggle Row Expanded').click();
  await page.getByRole('row', { name: 'Toggle Row Expanded 1 ' }).locator('a').nth(3).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('نام زیرگروه').click();
  await page.getByLabel('نام زیرگروه').fill(newsubgroupName);
  await page.getByRole('button', { name: 'تایید' }).click();
  // await page.getByText('تغییرات با موفقیت اعمال شد').click();
  // await waitForMessage(page,'تغییرات با موفقیت اعمال شد',1000);
  await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
  console.log('edit group'+{groupName}+'is sucess');
});

// test('edit sub name ', async ({ page }) => {
//   await login(page, superAdminName, superAdminPass);
//   // await fillGroupForm(page,groupName);
//   // await search(page,groupName);
//   // await fillSubGroupForm(page,subgroupName);
//   // await page.getByRole('link', { name: 'پیکربندی دستگاه'}).click();
//   // await fillDeviceForm(page, deviceData);
//   await addUser(page,idKarbar,deviceData.id ,subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
//   await page.getByRole('link', { name: 'گروه ها' }).click();
//   await search(page ,groupName);
//   await page.getByTitle('Toggle Row Expanded').click();
//   await page.getByRole('row', { name: 'Toggle Row Expanded 1 ' }).locator('a').nth(3).click();
//   await page.getByLabel('نام زیرگروه').click();
//   await page.getByLabel('نام زیرگروه').fill(newsubgroupName);
//   await page.getByRole('button', { name: 'تایید' }).click();
//   await page.getByText('تغییرات با موفقیت اعمال شد').click();
//   await waitForMessage(page,'تغییرات با موفقیت اعمال شد',1000);
  
// });

// delete    @group_ test5
test('delete group', async ({ page }) => {
 
  await login(page, superAdminName, superAdminPass);
  // await fillGroupForm(page, groupName);
  const deviceData2 = {
    id: getRandomId(8),
    name: generateRandomString(5, 'imei'),
    group: newNamegroup,
    specification: 'samsung a15 (API 34)'};
    await fillDeviceForm(page, deviceData2);
    await check(page,deviceData2.id, withoutToast);
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await dele(page,newNamegroup);
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');

    await page.getByRole('link', { name: 'پیکربندی دستگاه' }).click();
    await load(page);
    await search (page, deviceData2.id);
    const isRight = await page.isVisible(`text=${newNamegroup}`);
    expect(isRight);
    console.log('delete group'+{newNamegroup}+'is sucess');
});


});
