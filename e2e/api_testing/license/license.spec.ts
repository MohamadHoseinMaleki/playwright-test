import { login } from "../../ui_testing/general/general";
import { test, expect, Page } from '@playwright/test';
import { getJWT } from "../general";

const superAdminName = 'admin';
const superAdminPass = 'admin@123';


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