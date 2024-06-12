import { test } from "@playwright/test"

test("input fields", async ({ page }, testInfo) => {
  await page.goto("/")

  const isMobile = testInfo.project.name === 'mobile'

  isMobile && await page.locator('.sidebar-toggle').click()
  await page.getByText("Forms").click()
  await page.getByText("Form Layouts").click()
  isMobile && await page.locator('.sidebar-toggle').click()

  const usingTheGridEmailInput = page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })

  await usingTheGridEmailInput.fill("test@test.com")
  await usingTheGridEmailInput.clear()
  await usingTheGridEmailInput.fill("test2@test.com")
})
