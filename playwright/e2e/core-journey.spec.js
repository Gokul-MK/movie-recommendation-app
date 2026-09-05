// @ts-check
const { test, expect } = require('@playwright/test')

const BASE_URL = 'http://localhost:5173'

test('Core journey: search → details → watchlist → remove', async ({ page }) => {
    // ── 1. Open app ─────────────────────────────────────────
    await page.goto(BASE_URL)
    await expect(page).toHaveTitle(/CineAI|Movie/i)

    // ── 2. Search for "Inception" ────────────────────────────
    await page.locator('#search-input').fill('Inception')
    await page.locator('#search-button').click()

    // ── 3. Assert results grid appears ──────────────────────
    await page.waitForURL(/\/search\?q=Inception/i)
    const firstCard = page.locator('.card').first()
    await expect(firstCard).toBeVisible({ timeout: 15000 })

    // ── 4. Click the first movie card → details page ─────────
    await firstCard.locator('a').first().click()
    await page.waitForURL(/\/movie\/\d+/, { timeout: 10000 })
    await expect(page.locator('h1')).toBeVisible()

    // ── 5. Add to Watchlist ──────────────────────────────────
    const addBtn = page.locator('#add-to-watchlist-btn')
    await expect(addBtn).toBeVisible({ timeout: 10000 })
    // Grab the movie title before clicking
    const movieTitle = await page.locator('h1').first().textContent()

    await addBtn.click()
    // Button should change to "In Watchlist"
    await expect(addBtn).toContainText('In Watchlist', { timeout: 8000 })

    // ── 6. Navigate to Watchlist page ───────────────────────
    await page.goto(`${BASE_URL}/watchlist`)
    await page.waitForLoadState('networkidle')

    // ── 7. Assert movie appears in watchlist ────────────────
    const watchlistItem = page.locator('.card').filter({ hasText: movieTitle?.slice(0, 10) ?? 'Inception' }).first()
    await expect(watchlistItem).toBeVisible({ timeout: 10000 })

    // ── 8. Click Remove ──────────────────────────────────────
    const removeBtn = watchlistItem.locator('[id^="remove-btn"]')
    await removeBtn.click()

    // ── 9. Confirm it is gone ─────────────────────────────────
    await expect(watchlistItem).not.toBeVisible({ timeout: 8000 })
    // Optionally confirm empty state or remaining count is fewer
    console.log('✅ Core journey passed successfully')
})
