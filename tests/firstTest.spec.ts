import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await page.getByText("Forms").click()
  await page.getByText("Form Layouts").click()
})

test("locator syntax rules", async ({ page }) => {
  // by tag name
  await page.locator("input").first().click() //finds all of them

  // by id
  page.locator("#inputEmail1")

  //by class value
  page.locator(".shape-rectangle")

  // by attribute
  page.locator('[placeholder="Email"]')

  // by class value (full)
  page.locator(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]'
  )

  // combine selectors
  page.locator('input[placeholder="Email"][nbinput].shape-rectangle')

  // XPath (NOT Recommended)
  page.locator('//*[@id="inputEmail1"]')

  // by partial text match
  page.locator(':text("Using")')

  // by exact text match
  page.locator(':text-is("Using the Grid")')
})

test("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click()
  await page.getByRole("button", { name: "Sign in" }).first().click()
  await page.getByLabel("Email").first().click()
  await page.getByPlaceholder("Jane Doe").click()
  await page.getByText("Using the grid").click()
  await page.getByTestId("SignIn").click()
  await page.getByTitle("IoT Dashboard").click()
})

test("Locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click()
  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign In" })
    .first()
    .click()
  await page.locator("nb-card").nth(3).getByRole("button").click()
})

test("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click()
  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click()
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .getByRole("textbox", { name: "Email" })
    .click()
  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click()

  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click()
  await page
    .getByText("Using the Grid")
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click()
})

test("Reusing the locaotrs", async ({ page }) => {
  const testEmailAddress = "test@test.com"
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" })
  const emailField = basicForm.getByRole("textbox", { name: "Email" })

  await emailField.fill(testEmailAddress)
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123")
  await basicForm.getByRole("button").click()

  await expect(emailField).toHaveValue(testEmailAddress)
})

test("extracting values", async ({ page }) => {
  // Single test value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" })
  const buttonText = await basicForm.locator("button").textContent()
  expect(buttonText).toEqual("Submit")

  // Array of text values
  const allRadioButtonLabels = await page.locator("nb-radio").allTextContents()
  expect(allRadioButtonLabels).toContain("Option 1")

  // input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" })
  await emailField.fill("test@test.com")
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual("test@test.com")

  // attribute
  const placeholderValue = await emailField.getAttribute("placeholder")
  expect(placeholderValue).toEqual("Email")
})

test("assertions", async ({ page }) => {
  // General assertions
  const value = 5
  expect(value).toEqual(5)

  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .locator("button")

  const text = await basicFormButton.textContent()
  expect(text).toEqual("Submit")

  // locator assertion
  await expect(basicFormButton).toHaveText("Submit")

  // soft assertion (continues even if it fails)
  await expect.soft(basicFormButton).toHaveText("Submit")
  await basicFormButton.click()
})
