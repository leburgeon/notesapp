const { test, expect } = require('@playwright/test')
const { describe } = require('node:test')

describe('Note app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')
  
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app created during UoH FSO')).toBeVisible()
  })  

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')
    
    await page.getByRole('button', {name: 'Login'}).click()

    await page.getByTestId('username').fill('usery')
    await page.getByTestId('password').fill('passy')

    await page.getByRole('button', {name: 'Login', exact: true}).click()
  })
})