const { test, expect, describe, beforeEach } = require('@playwright/test')
const exp = require('constants')
const {loginWith, createNote} = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'luigi',
        username: 'testuser',
        password: 'Password1!'
      }
    })
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app created during UoH FSO')).toBeVisible()
  })  

  test('can login with correct credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'Password1!')
    await expect(page.getByTestId('notesDisplayDiv')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'testuser', 'wrongpassword')   
    await expect(page.getByText('Wrong credz')).toBeVisible()
  })

  describe('when a user is logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'Password1!')
    })

    test('a note can be created', async ({ page }) => {
      await createNote(page, 'a note created with playwright')
      await expect(page.getByText('a note created with playwright')).toBeVisible()
    })

    describe('and several notes exist', () => {
      beforeEach(async ( {page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('the notes are visible', async ({ page }) => {
        await expect(page.getByText('first note')).toBeVisible()
        await expect(page.getByText('second note')).toBeVisible()
        await expect(page.getByText('third note')).toBeVisible()
      })

      test('importance of one can be toggled', async ({ page }) => {
        await page.pause()
        const noteTextElement = await page.getByText('second note')
        const noteElement = noteTextElement.locator('..')
        await noteElement.getByRole('button', {name: 'make not important'}).click()
        await expect(noteElement.getByRole('button', {name: 'make important'})).toBeVisible()
      })
    })
  })
})