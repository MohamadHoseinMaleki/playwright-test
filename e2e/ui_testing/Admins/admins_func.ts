import { expect, Page } from "@playwright/test";
import { search } from "../Groups/group_func";
import { waitForMessage, waitForToastMessage } from "../general/general";

export async function create_miniadmin(page: Page, name: string, password: string, license: string) {
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page.getByLabel('نام کاربری', { exact: true }).fill(name);
  await page.getByLabel('رمزعبور').fill(password);
  await page.getByLabel('مجوز').click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await selectOptionUsingArrowKeys(page, license);
  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('mini admin');
}

async function selectOptionUsingArrowKeys(page: Page, license: string) {
  let optionSelected = false;

  while (!optionSelected) {
    // دریافت تمام گزینه‌ها
    const options = await page.$$('.rc-virtual-list-holder-inner .ant-select-item-option');
    for (const option of options) {
      // دریافت متن هر گزینه
      const textContent = await option.textContent();
      // console.log(`Option text: ${textContent}`);
      if (textContent && textContent.includes(license)) {
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


export async function deleteAdmin(page:Page,AdName) {
  await search(page,AdName);
    await page.getByRole('row', { name: AdName }).locator('a').nth(3).click();
    await page.mouse.move(5,10);
    await page.waitForTimeout(2000);
    await page.locator('button', { hasText: 'تایید' }).click();
    await waitForToastMessage(page,'تغییرات با موفقیت اعمال شد');
    // const ok =page.getByText('تغییرات با موفقیت اعمال شد'); 
    // expect(ok);
    // await waitForMessage(page,'تغییرات با موفقیت اعمال شد',1000);
    await search(page,AdName);
    // await page.waitForTimeout(300);
    const rowLocator = page.getByRole('row', { name: AdName });
    await expect(rowLocator).toBeHidden();
    console.log('deleteAdmin is sucess');
}

export async function create_ad(page, name, password){
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('نام کاربری', {exact: 'true'}).click();
  await page.getByLabel('نام کاربری', {exact: 'true'}).fill(name);
  await page.getByLabel('رمزعبور').waitFor({state: 'visible'});
  await page.getByLabel('رمزعبور').click();
  await page.getByLabel('رمزعبور').fill(password);
  await page.getByLabel('مجوز').click();
  await page.getByText('مدیر کل 1000').click();
  await page.getByRole('button', { name: 'تایید' }).click();
}

export async function create_miniad(page, name, password, license){
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('نام کاربری', {exact: 'true'}).click();
  await page.getByLabel('نام کاربری', {exact: 'true'}).fill(name);
  await page.getByLabel('رمزعبور').waitFor({state: 'visible'});
  await page.getByLabel('رمزعبور').click();
  await page.getByLabel('رمزعبور').fill(String(password));
  // await page.waitForTimeout(1000);
}

export async function add_miniadmin(page, name, password, license,fName,family,Nid,pCode,number,phoneNum,company,room,describ){
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('نام کاربری', {exact: 'true'}).click();
  await page.getByLabel('نام کاربری', {exact: 'true'}).fill(name);
  await page.getByLabel('رمزعبور').waitFor({state: 'visible'});
  await page.getByLabel('رمزعبور').click();
  await page.getByLabel('رمزعبور').fill(password);
  await page.getByLabel('مجوز').click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await selectOptionUsingArrowKeys(page, license);
  // await page.getByLabel('مجوز').click();
  // await page.getByText(`${license.name} ${license.capacity}`, {state: 'visible'}).click();
  await page.getByLabel('نام', { exact: true }).click();
  await page.getByLabel('نام', { exact: true }).fill(fName);
  await page.getByLabel('نام خانوادگی').click();
  await page.getByLabel('نام خانوادگی').fill(family);
  await page.getByLabel('کد ملی').click();
  await page.getByLabel('کد ملی').fill(Nid);
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
}

 
export async function find_miniadmin_row(page, name, license) {
    let forg_miniadmin_obj = {
        name: '',
        license: ''
      }
      const rows = await page.getByRole('row');
      const rowCount = await rows.count();
      console.log('rowCount: ', rowCount);
      for(let i=rowCount-1; i>=1; i--){
        const row = rows.nth(i);
        console.log('row', row);
        const findName = await row.getByRole('cell').nth(1).innerText();
        const findLicense = await row.getByRole('cell').nth(2).innerText();
        console.log('findName: ', findName);
        console.log('findCapacity: ', findLicense);
    
        if(name == findName && license == findLicense){
            forg_miniadmin_obj.name = name;
            forg_miniadmin_obj.license = license;
            console.log('find_miniadmin_row: ', find_miniadmin_row);
            return forg_miniadmin_obj;
        }
      }
      return null;
}

export async function editAdminLincens(page:Page,AdName,licenseName,newlinsence) {
  await search(page,AdName);
  await page.getByRole('row', { name: AdName }).locator('a').nth(2).click();
  await page.getByLabel('ویرایش').getByTitle(licenseName).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  // await page.getByText(newlinsence).click();
  await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
  await selectOptionUsingArrowKeys(page, newlinsence);
  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('edit'+{AdName}+'AdminLincens to '+{newlinsence});
}


export async function add_miniad(page, name, password){
  await page.getByRole('button', { name: 'plus افزودن مدیر جدید' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.getByLabel('نام کاربری', {exact: 'true'}).click();
  await page.getByLabel('نام کاربری', {exact: 'true'}).fill(name);
  await page.getByLabel('رمزعبور').waitFor({state: 'visible'});
  await page.getByLabel('رمزعبور').click();
  await page.getByLabel('رمزعبور').fill(password);
  
  await page.getByRole('button', { name: 'تایید' }).click();
}


export async function adminAccess(page:Page,AdName,groupName) {
  await search(page,AdName);
  await page.getByRole('row', { name: AdName }).locator('a').first().click();
  const groupRowSelector = `tr:has-text("${groupName}")`;
  const groupRow = page.locator(groupRowSelector);
  if (await groupRow.count() === 0) {
    throw new Error(`Group with name ${groupName} not found`);
  }
  const restrictedButton = groupRow.locator('text="محدود"');
  await restrictedButton.click();
  await page.locator('text="نامحدود"').click();

  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('adminAccess to group:'+{groupName});
}


export async function changePass(page: Page, AdName: string, newpass: string) {
  await search(page,AdName);
  await page.getByRole('row', { name: AdName }).locator('a').nth(1).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  const passwordSelector = '#password';
  const confirmPasswordSelector = '#passwordConfimation';

  await page.waitForSelector(passwordSelector);
  await page.waitForSelector(confirmPasswordSelector);

  await page.locator(passwordSelector).fill(newpass);
  await page.locator(confirmPasswordSelector).fill(newpass);
  await page.getByRole('button', { name: 'تایید' }).click();
  console.log('admin pass is change to :'+{newpass});
}


export async function editAdminFields(page:Page,AdName,newfname,newfamily,newNid,newpCode,newnum,newphoneNum,newcompany,newroom,newdescrib) {
  await search(page,AdName);
  await page.getByRole('row', { name: AdName }).locator('a').nth(2).click();
  await page.getByLabel('نام', { exact: true }).click();
  await page.getByLabel('نام', { exact: true }).fill(newfname);
  await page.getByLabel('نام خانوادگی').click();
  await page.getByLabel('نام خانوادگی').fill(newfamily);
  await page.getByLabel('کد ملی').click();
  await page.getByLabel('کد ملی').fill(newNid);
  await page.getByLabel('کد پرسنلی').click();
  await page.getByLabel('کد پرسنلی').fill(newpCode);
  await page.getByLabel('تلفن', { exact: true }).click();
  await page.getByLabel('تلفن', { exact: true }).fill(newnum);
  await page.getByLabel('تلفن همراه', { exact: true }).click();
  await page.getByLabel('تلفن همراه').fill(newphoneNum);
  await page.getByLabel('شرکت').click();
  await page.getByLabel('شرکت').fill(newcompany);
  await page.getByLabel('دفتر کار').click();
  await page.getByLabel('دفتر کار').fill(newroom);
  await page.getByLabel('توضیحات').click();
  await page.getByLabel('توضیحات').fill(newdescrib);
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('row', { name: AdName }).locator('a').nth(2).click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });

  await expect(page.getByLabel('نام', { exact: true })).toHaveValue(newfname);
  await expect(page.getByLabel('نام خانوادگی')).toHaveValue(newfamily);
  await expect(page.getByLabel('کد ملی')).toHaveValue(newNid);
  await expect(page.getByLabel('کد پرسنلی')).toHaveValue(newpCode);
  await expect(page.getByLabel('تلفن', { exact: true })).toHaveValue(newnum);
  await expect(page.getByLabel('تلفن همراه', { exact: true })).toHaveValue(newphoneNum);
  await expect(page.getByLabel('شرکت')).toHaveValue(newcompany);
  await expect(page.getByLabel('دفتر کار')).toHaveValue(newroom);
  await expect(page.getByLabel('توضیحات')).toHaveValue(newdescrib);
  await page.getByText('لغو').click();
  console.log('edit Admin Fields is sucess');
}