import { test, expect, Page } from '@playwright/test';

export async function getJWT(request: any) {
    const url = 'http://192.168.136.90/back-api/admin/login'; 
    const data = { name: 'admin', password: 'admin@123' }; 
    const newLogin = await request.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    const responseBody = await newLogin.json();
    expect(newLogin.status()).toBe(200);
    expect(responseBody).toHaveProperty('message', 'login success');
  
    const jwt = responseBody.payload?.jwt || null;
    console.log('Login success, JWT:', jwt);
    
    return jwt;
  }