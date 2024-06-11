import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto(process.env.URL)
  await page.getByText("Button Triggering AJAX Request").click()
  testInfo.setTimeout(testInfo.timeout +2000)
})

test("Auto Waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success")

  //   const text = await successButton.textContent()  // waits automatically (upto default 30s)
  //   expect(text).toEqual('Data loaded with AJAX get request.')

  //   await successButton.waitFor({state: 'attached'}) // waits upto default 30s
  //   const text2 = await successButton.allTextContents() // fails doesn't wait by itself (must use waitFor(...))
  //   expect(text2).toContain('Data loaded with AJAX get request.')

  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  }) // waits default  upto 5s, unless overridden
})

test.skip("alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success")

  // wait for element
  //await page.waitForSelector(".bg-success")

  // wait for particular response
  //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

  // wait for network calls to be completed (NOT RECOMMENDED)
  await page.waitForLoadState("networkidle")

  const text2 = await successButton.allTextContents()
  expect(text2).toContain("Data loaded with AJAX get request.")
})

test.skip("timeouts", async ({ page }) => {
  //test.setTimeout(10000)
  test.slow()
  const successButton = page.locator(".bg-success")
  await successButton.click()
})
