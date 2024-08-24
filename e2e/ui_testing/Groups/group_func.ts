import { test, expect, Page } from '@playwright/test';
import { load } from '../general/general';

async function selectOptionUsingArrowKeys(page: Page, obj: string) {
  let optionSelected = false;

  while (!optionSelected) {
    // دریافت تمام گزینه‌ها
    const options = await page.$$('.rc-virtual-list-holder-inner .ant-select-item-option');
    for (const option of options) {
      // دریافت متن هر گزینه
      const textContent = await option.textContent();
      // console.log(`Option text: ${textContent}`);
      if (textContent && textContent.includes(obj)) {
        optionSelected = true;
        console.log(`Selecting option: ${textContent}`);
        await option.scrollIntoViewIfNeeded(); 
        // await page.waitForTimeout(500); 
        await option.click(); 
        break; // خروج از حلقه بعد از انتخاب گزینه
      }
    }
    if (!optionSelected) {
      // اگر گزینه پیدا نشد، به گزینه بعدی بروید
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
    }
  }
}

export async function fillGroupForm(page: Page, groupName: string) {
    await page.getByRole('link', { name: 'گروه ها' }).click();
    await load(page);
    await page.getByRole('button', { name: 'plus افزودن گروه' }).click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.getByLabel('نام').click();
    await page.getByLabel('نام').fill(groupName);
    await page.getByRole('button', { name: 'تایید' }).click();
    console.log('fillGroupForm '+{groupName})
  }

  export async function search(page:Page, Name) {
    try {
      await page.getByPlaceholder('جستجو کنید').click();
      await page.getByPlaceholder('جستجو کنید').fill(Name);
      await page.getByPlaceholder('جستجو کنید').press('Enter');
      await page.waitForTimeout(300);
      console.log(`Search completed for: ${Name}`);
    } catch (error) {
      console.error(`Error search for ${Name} (not found):`, error);    }
  }


export async function filldoubleForm(page, groupName) {
    await page.getByRole('button', { name: 'plus افزودن گروه', TIMEOUT:(200)}).click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.getByLabel('نام').click();
    await page.getByLabel('نام').fill(groupName);
    await page.getByRole('button', { name: 'تایید' }).click();
    // await page.waitForTimeout(300);
}

export async function fillSubGroupForm(page,subName) {
  await page.getByRole('row', { name: 'Toggle Row Expanded' }).locator('a').first().click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('نام زیرگروه').click();
  await page.getByLabel('نام زیرگروه' ).fill(subName ,{TIMEOUT:(800)});
  await page.getByRole('button', { name: 'تایید' }).click();
  // await page.waitForTimeout(900);
  console.log('fillSubGroupForm '+{subName})
}
  
export function generateUnauthorizeNames(length: number, type: string) {
    let characters='!@#$#%^&**()_+';
    if (type === 'serial'){
      characters = '0123456789';
    }
    if (type === 'name'){
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }
    let result = '';
    for(let i=0; i< length; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function fillDeviceForm(page: Page, { id, name, group, specification }) {
  await page.getByRole('button', { name: 'plus دستگاه جدید' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('شناسه').click();
  await page.getByLabel('شناسه').fill(id);
  await page.getByLabel('نام').click();
  await page.getByLabel('نام').fill(name);
  await page.getByLabel('گروه').click();
  // await page.waitForTimeout(900);
  // await page.locator(`text=${group}`).click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await selectOptionUsingArrowKeys(page, group);

  await page.getByLabel('مشخصات').click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await page.locator(`text=${specification}`).click();
  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('fillDeviceForm  '+{id})
}

// export async function addDevice(page,groupName) {
// const deviceData = {
//     id: getRandomId(8),
//     name: generateRandomString(5, 'imei'),
//     group: groupName,
//     specification: 'fadfas fadsfasdf (API 34)'
//   };
//     await fillDeviceForm(page, deviceData);
// }

export async function dele(page: Page, name: string){
  try{
    await search(page,name);
    await page.getByRole('row', { name: 'Toggle Row Expanded 1' }).locator('a').nth(2).click();
    // await page.waitForSelector('.ant-popover-inner', { state: 'visible' });
    // await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'تایید' }).click();
    console.log(`Clicked delete for group ${name}.`);
}catch (error) {
      console.error('Error during delete operation:', error);}
}



export async function check(page: Page, ObjName: string, mode: 'success' | 'withoutToast' | 'failed', message?: string) {
  try {
    if (mode === 'success') {
      if (message) {
        await page.waitForSelector(`text=${message}`);
        console.log(`Success message '${message}' is visible.`);
      } else {
        console.error('No message provided for success mode.');
      }
    } else if (mode === 'withoutToast') {
      await search(page, ObjName);
      const isPresent = await page.isVisible(`text=${ObjName}`);
      if (isPresent) {
        console.log(`Object '${ObjName}' is present on the page.`);
      } else {
        console.log(`Object '${ObjName}' is NOT present on the page.`);
      }
    } else if (mode === 'failed') {
      throw new Error(`Failed operation for object: ${ObjName}`);
    }
  } catch (error) {
    console.error('Error during operation:', ObjName, error);
    
  }
}