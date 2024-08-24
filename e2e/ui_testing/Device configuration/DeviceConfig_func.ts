import { test, expect ,Page} from '@playwright/test';
import { search } from '../Groups/group_func';
import { selectOptionUsingArrowKeys, waitForToastMessage } from '../general/general';

export function getRandomId(length) {
    let characters = 'ABCDEabcde0123456789';
    let result= ''
    for(let i=0; i< length; i++)
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
}

export async function fillDeviceForm(
  page: Page, 
  deviceData: { id: string; name: string; group: string; specification: string }
) {
  const { id, name, group, specification } = deviceData;

  await page.getByRole('button', { name: 'plus دستگاه جدید' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('شناسه').click();
  await page.getByLabel('شناسه').fill(id);
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill(name);
  await page.getByLabel('گروه').click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await selectOptionUsingArrowKeys(page, group);
  await page.getByLabel('مشخصات').click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await page.locator(`text=${specification}`).click();
  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('fillDeviceForm  ' + id);
}


export async function edit_device(page:Page,deviceID,newname) {
  await search(page,deviceID);
  await page.locator('div:nth-child(7) > .m-primary-text-color').click();
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill(newname);
  await page.getByRole('button', { name: 'تایید' }).click();

}

export async function lockOrUnlock_device(page:Page,deviceID) {
  await search(page,deviceID);
  await page.locator('div:nth-child(4) > .m-primary-text-color').click();
  await page.mouse.move(20,10);
  await page.locator('button', { hasText: 'تایید' }).click();
  await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
  console.log('staus of lock/unlock device is change :'+ deviceID);
}


export async function delete_device(page:Page,deviceID) {
await search(page,deviceID);
await page.locator('.deleteShow > .m-primary-text-color').click();
await page.mouse.move(20,10);
await page.locator('button', { hasText: 'تایید' }).click();
await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
console.log('delete device: '+ deviceID +' is sucsess ');
}

export async function factoryReset_device(page:Page,deviceID) {
await search(page,deviceID);
await page.locator('div:nth-child(5) > .m-primary-text-color').click();
await page.mouse.move(20,10);
await page.locator('button', { hasText: 'تایید' }).click();
await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
console.log('factoryReset device: '+ deviceID +' is sucsess ');
}

export async function setSoftware_device(page:Page,deviceID,software:string) {
await search(page,deviceID);
await page.locator('div:nth-child(2) > .m-primary-text-color').click();
await page.waitForSelector('[role="dialog"]', { state: 'visible' });
await search(page,software);
await page.getByLabel('', { exact: true }).click();
await page.getByRole('button', { name: 'ادامه' }).click();
await page.getByRole('button', { name: 'تایید' }).click();
console.log('set Software :'+ software +'  for device: '+ deviceID +' is sucsess ');
}

export async function addUser(page:Page, idKarbar,deviceID: string, userPass:string ,subgroupName: string | RegExp,name: string,family: string,id: string,pCode: number,number: string,phoneNum: string,company: string,room: string,describ: string) {
  await search(page,deviceID);
  await page.locator('.m-primary-text-color').first().click();
  await page.getByLabel('شناسه کاربر').click();
  await page.getByLabel('شناسه کاربر').fill(idKarbar);
  await page.getByLabel('رمزعبور').fill(userPass);
  await page.getByLabel('زیرگروه کاربری').click();
  await page.getByText(subgroupName, { exact: true }).click();
  await page.getByLabel('نام', { exact: true }).click();
  await page.getByLabel('نام', { exact: true }).fill(name);
  await page.getByLabel('نام خانوادگی').click();
  await page.getByLabel('نام خانوادگی').fill(family);
  await page.getByLabel('کد ملی').click();
  await page.getByLabel('کد ملی').fill(id);
  await page.getByLabel('کد پرسنلی').click();
  await page.getByLabel('کد پرسنلی').fill('12122');
  await page.getByLabel('تلفن', { exact: true }).click();
  await page.getByLabel('تلفن', { exact: true }).fill(number);
  await page.getByLabel('تلفن همراه', { exact: true }).click();
  await page.getByLabel('تلفن همراه').fill(phoneNum);
  await page.getByLabel('شرکت').click();
  await page.getByLabel('شرکت').fill(company);
  await page.getByLabel('دفتر کار').click();
  await page.getByLabel('دفتر کار').fill(room);
  await page.getByLabel('توضیحات').click();
  await page.getByLabel('توضیحات').fill(describ);
  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('add user is sucess')
}

// export async function selectDropdownOption(page: Page, dropdownSelector: string, optionToSelect: string | null = null) {
//   await page.click(dropdownSelector);
//   const options = await page.locator(`${dropdownSelector} option`).allTextContents();
//   let selectedOption;
//   if (optionToSelect) {
//     if (!options.includes(optionToSelect)) {
//       throw new Error(`Option "${optionToSelect}" not found in dropdown`);
//     }
//     selectedOption = optionToSelect;
//   } else {
//     const randomIndex = Math.floor(Math.random() * options.length);
//     selectedOption = options[randomIndex];
//   }
//   await page.selectOption(dropdownSelector, { label: selectedOption });
//   console.log(`Selected option: ${selectedOption}`);
// }




// export async function loginTo43(page, user, password) {
//   await page.goto('http://192.168.136.43/');
//   await page.goto('http://192.168.136.43/user/login');
//   await page.goto('http://192.168.136.43/user/login/');
//   await page.getByPlaceholder('نام کاربری').fill(user);
//   await page.getByPlaceholder('نام کاربری').press('Tab');
//   await page.getByPlaceholder('رمزعبور').fill(password);
//   await page.getByPlaceholder('رمزعبور').press('Tab');
//   await page.getByRole('button', { name: 'ورود' }).press('Enter');
  
// }
// function selectOptionUsingArrowKeys(page: Page, group: any) {
//   throw new Error('Function not implemented.');
// }

