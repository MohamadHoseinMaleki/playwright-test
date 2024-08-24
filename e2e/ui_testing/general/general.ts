import { test, expect, Page } from '@playwright/test';

export function generateRandomString(length, type) {
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

export function generatePhoneNum (length: number){
  let characters='0123456789';
  let result = '09';
  for(let i=0; i< length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateNationalId (length: number) {
  let characters='0123456789';
  let result = '11';
  for(let i=0; i< length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomNumber(min, max){
return Math.floor(Math.random()*(max-min+1)+min);
}

export async function login(page, user, password) {
    // await page.goto('http://192.168.136.90/');
    // await page.goto('http://192.168.136.90/user/login');
    await page.goto('http://192.168.136.90/user/login/');
    await page.getByPlaceholder('نام کاربری').fill(user);
    // await page.getByPlaceholder('نام کاربری').press('Tab');
    await page.getByPlaceholder('رمزعبور').fill(password);
    await page.getByPlaceholder('رمزعبور').press('Tab');
    await page.getByRole('button', { name: 'ورود' }).press('Enter');
    await page.waitForTimeout(200);
    await page.waitForURL('http://192.168.136.90/config-device');
    console.log('login is sucess');
}

export async function exit(page: Page, adminName: string) {
  await page.locator('span').filter({ hasText: adminName }).first().hover();
  await page.locator('span').filter({ hasText: adminName }).first().click();
  await page.waitForSelector('ul.ant-dropdown-menu', { state: 'visible' });
  await page.getByRole('menuitem', { name: 'logout خروج' }).click();
  await page.waitForSelector('input[placeholder="نام کاربری"]', { state: 'visible' });

  console.log('Logout is successful');
}

export async function waitForMessage(page, message, timeout = 30000) {
    await expect(async () => {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain(message);
    }).toPass({
      timeout: timeout,
      intervals: [1000, 2000, 5000] // Adjust these intervals as needed
    });
  }


  export function generatePassword() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@#$%^&+=';
    
    let allCharacters = letters + numbers + symbols;
    let password = '';
  
    password += letters.charAt(Math.floor(Math.random() * letters.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
    for (let i = password.length; i < 8; i++) {
      password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }
      password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
  }


  export  async function generateWrongPass():Promise<string> {
    const letters = 'pqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    const numbers = '0123456789 ';
    const symbols = '@#$%^&+= ';
    
    let allCharacters = letters + numbers + symbols;
    let password = ' ';
  
    password += letters.charAt(Math.floor(Math.random() * letters.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
    for (let i = password.length; i < 8; i++) {
      password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }
      password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}

export async function load(page) {
  await page.waitForSelector('[role="rowgroup"]', {
    state: 'visible' 
  });
  await page.waitForTimeout(200);
  await page.waitForSelector('.td', {
    state: 'visible' 
  });
 
}

export async function waitForToastMessage(page:Page, expectedMessage: string) {
  try {
    
    const toastLocator = page.locator('.ant-message-notice-content');
    await toastLocator.waitFor({ state: 'visible' });

    const toastText = await toastLocator.innerText();

    if (toastText.includes(expectedMessage)) {
      console.log('Toast message is correct:', toastText);
    } else {
      console.log('Toast message is incorrect:', toastText);
    }
  } catch (error) {
    console.log('Toast message did not appear or another error occurred:', error);
  }
}

export async function selectOptionUsingArrowKeys(page: Page, obj: string) {
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


// module.exports = {
//     generateRandomString,
//     getRandomNumber,
//     login,
//     waitForMessage,
//     generateNationalId,
//     generatePhoneNum,
//     generatePassword
    
// }