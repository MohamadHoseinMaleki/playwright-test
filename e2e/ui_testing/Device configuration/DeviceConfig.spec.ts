import { test, expect ,Page } from '@playwright/test';
import {generateRandomString, waitForMessage, login, getRandomNumber, generateNationalId, generatePhoneNum, waitForToastMessage, load, generatePassword} from '../general/general';
import { addUser, delete_device, edit_device, fillDeviceForm, getRandomId, lockOrUnlock_device } from './DeviceConfig_func';
import { generateUnauthorizeNames, search } from '../Groups/group_func';

const superAdminName = 'admin';
const superAdminPass = 'admin@123';
const groupName = generateRandomString(5,'imei');
const deviceID= getRandomId(8) ;
const AdPass = generatePassword();

const subgroupName = generateRandomString(5, 'serial');
const name= generateRandomString(4,'serial');
const family=generateRandomString(4,'serial');
const Nid= generateNationalId(5);
const pCode=getRandomNumber(4,5) ;
const number=generatePhoneNum(8);
const phoneNum=generatePhoneNum(8);
const company =generateRandomString(5,'imei') ;
const room= generateRandomString(5,'serial') ;
const describ= generateRandomString(6,'serial');
const pass = getRandomId(8);
const idKarbar=generateRandomString(5,'imei');
const newname = generateRandomString(5,'imei');
const idKarbar2=generateRandomString(5,'imei');

const deviceData: { id: string; name: string; group: string; specification: string } = {
    id: getRandomId(8),
    name: generateRandomString(5, 'imei'),
    group: 'json_gson',
    specification: 'lg a (API 34)'
};

const deviceDataSpecial = {
    id: getRandomId(8),
    name: generateUnauthorizeNames(5,'imei'),
    group: 'گروه عمومی',
    specification: 'lg a (API 34)'
};


// test('apn test' ,async({page})=>{
//     await loginTo43(page, superAdminName, superAdminPass);
//     await fillDeviceForm(page,deviceData);
//     await search(page,deviceData.id);
//     await addUser(page,idKarbar,deviceData.id ,subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
//     await page.locator('tr:nth-child(5) > td:nth-child(7) > .ant-space > div:nth-child(5) > .m-primary-text-color').click();

//     await page.getByRole('cell', { name: 'Toggle Row Expanded' }).click();
// })

test('@device_test1',async({page})=>{
    //@device_test1-1       //add device 
   await login(page,superAdminName,superAdminPass);
   await load(page);
   await fillDeviceForm(page,deviceData);
   await search(page,deviceData.id);
   const isPresent = await page.isVisible(`text=${deviceData.name}`);
   expect(isPresent); 

   //@device_test1-2      //add duplicate device
   await fillDeviceForm(page,deviceData);
   await waitForToastMessage(page,`شناسه دستگاه تکراری است (Code: 13)`);
   await page.getByText('لغو').click();

   //@device_test1-3      //fill device form with special charakter 
   await fillDeviceForm(page,deviceDataSpecial);
   
});


test('@device_test2',async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await load(page);
    //search shenase device 
    await search(page,deviceData.id);
    const tr =page.getByRole('cell', { name: deviceData.id }).locator('span');
    expect(tr);

    //search device name
    await search(page, deviceData.name);
    const idCell = page.getByRole('cell', { name: deviceData.name }).locator('span');
    await expect(idCell).toBeVisible();

    // //search device group
    // await search(page, deviceData.group);
    // const groupCell = page.getByRole('cell', { name: deviceData.group }).locator('span');
    // await expect(groupCell);
});


test('@device_test3',async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await load(page);
    await search(page,deviceDataSpecial.id);
    await delete_device(page,deviceDataSpecial.id);
    await search(page,deviceDataSpecial.id);
    const rowLocator = page.getByRole('row', { name: deviceDataSpecial.id });
    await expect(rowLocator).toBeHidden();
    console.log('deleteAdmin is sucess');
});

test('@device_test4',async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await load(page);
    await search(page,deviceData.id);
    await lockOrUnlock_device(page,deviceData.id);
    console.log('device is loocked');
    await lockOrUnlock_device(page,deviceData.id);
    console.log('device when loading canseled');
    await page.locator('div:nth-child(4) > .m-primary-text-color').click({ clickCount: 3 });

});

test('@device_test5',async({page})=>{
    await login(page,superAdminName,superAdminPass);
    await load(page);
    await search(page,deviceData.id);


});

test('@device_test6',async({page})=>{
    //@device_test6-1
    await login(page,superAdminName,superAdminPass);
    await load(page);
    await search(page,deviceData.id);
    await edit_device(page,deviceData.id,newname);
    await page.getByRole('button', { name: 'لغو' }).click();
    //@device_test6-2
    await edit_device(page,deviceData.id,'');
    await page.getByText('فیلد نام اجباریست');
    await page.getByRole('button', { name: 'لغو' }).click();
});


test('@device_test7',async({page})=>{
    // add user with right info   @device_test7-1
    await login(page,superAdminName,superAdminPass);
    await load(page);
    await search(page,deviceData.id);
    await addUser(page,idKarbar,deviceData.id,'admin@123',subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
    await search(page,deviceData.id);
    await page.getByTitle('Toggle Row Expanded').click();
    await page.waitForSelector('.vtable-1 > div:nth-child(2) > div > div > div > .tr > div:nth-child(2)', { state: 'visible' });
    const visible = page.getByRole('cell', { name: '222' }).locator('span');
    expect(visible);
    //@device_test7-2      ADD DUPLICATE USER
    await addUser(page,idKarbar,deviceData.id,'admin@123',subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
    await waitForToastMessage(page,'شناسه کاربر تکراری است (Code');
    await page.getByRole('button', { name: 'لغو' }).click();
 
    //use special charakter    @device_test7-3
    await addUser(page,idKarbar,deviceData.id,'admi !23',subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
    await page.getByText('رمز عبور باید حداقل 8');
    await page.getByRole('button', { name: 'لغو' }).click();

    //use persion word   @device_test7-3
    await addUser(page,idKarbar,deviceData.id,'سسس!23',subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
    await page.getByText('رمز عبور باید حداقل 8');
    await page.getByRole('button', { name: 'لغو' }).click();

    //use special word   @device_test7-3
    await addUser(page,idKarbar2,deviceData.id,'admin@123',subgroupName,name,family,Nid,pCode,number,phoneNum,company,room,describ);
    await page.getByText('رمز عبور باید حداقل 8');
    await page.getByRole('button', { name: 'لغو' }).click();

});