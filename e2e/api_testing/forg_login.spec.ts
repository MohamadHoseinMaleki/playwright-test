import { test, expect } from '@playwright/test';

const data = { name: 'admin', password: 'admin@123' };
const url = 'http://192.168.136.90/back-api/admin/login';

let jwt = '';

test.describe('API Testing Basics', () => {
    test('should create new user by API request', async ({ request }) => {
        const newLogin = await request.post(url, {
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseBody = await newLogin.json(); 

        expect(newLogin.status()).toBe(200);
        expect(responseBody).toHaveProperty('message', 'login success');

        jwt = responseBody.payload?.jwt;
        console.log('login success , jwt:'+{jwt});
    });
});

