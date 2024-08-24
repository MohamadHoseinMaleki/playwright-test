import { test, expect, Page } from '@playwright/test';
import { login } from '../../ui_testing/general/general';
import { getJWT } from '../general';

const superAdminName = 'admin';
const superAdminPass = 'admin@123';


  // avaibale mini admin and no license,  checking api:

test('API test', async ({ page, request }) => {
  const jwtToken =  await getJWT(request);
 
    const url = 'http://192.168.136.90/back-api/release';
    const requestData ={
        "date": "1722772298760",
        "id": "609",
        "imei1": "122321331231111",
        "imei2": "111111123123123",
        "serialNumMob": "11211212SDFSADF",
        "status": "released",
        "admin": {
          "id": "0",
          "name": "admin",
          "license": {}
        }
      };
 
    // const response = await request.put(url, {
    //     data: requestData,
    //     headers: {
    //         'Content-Type': 'application/json',
    //          'Authorization': `Bearer ${jwtToken}`
    //     }
    // });
 
    // expect(response.status()).toBeGreaterThanOrEqual(200);
    // expect(response.status()).toBeLessThan(500);
 
    // const responseBody = await response.json();
       
    //  expect(responseBody).toHaveProperty('message', 'update license failed');
    //  expect(responseBody).toHaveProperty('payload');
    //  expect(responseBody.payload).toHaveProperty('toast', 'api.error.mutation');
    //  expect(responseBody).toHaveProperty('result', 43);
 
    //  expect(responseBody).not.toHaveProperty('success');
 })