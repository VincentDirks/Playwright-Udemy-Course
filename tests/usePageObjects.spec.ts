import { expect, test } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { NavigationPage } from "../page-objects/navigationPage"
import { FormLayoutsPage } from "../page-objects/formLayoutsPage"
import { DatePickerPage } from "../page-objects/datePickerPage"
import { faker } from "@faker-js/faker"

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("/")
})

test("navigate to all pages", async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  await navigateTo.formLayoutsPage()
  await navigateTo.datePickerPage()
  await navigateTo.smartTablepage()
  await navigateTo.toastrPage()
  await navigateTo.tooltipPage()
})

test("parameterised methods", async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  const onFormLayoutsPage = new FormLayoutsPage(page)

  await navigateTo.formLayoutsPage()
  await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption(
    "test@test.com",
    "Welcome1",
    "Option 2"
  )
  await onFormLayoutsPage.submitInLineFormWithNameEmailAndCheckbox(
    "John Smith",
    "john@test.com",
    true
  )
})

test("DatePickerPage Object", async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  const onDatepickerPage = new DatePickerPage(page)

  await navigateTo.datePickerPage()
  await onDatepickerPage.selectCommonDatePickerDateFromToday(10)
  await onDatepickerPage.selectDatePickerWithRangeFromToday(6, 15)
})

test("Page Manger", async ({ page }) => {
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName({
    // sex: "male",       // specify sex (optional)
    // lastName: "Johns", // specify last name (optional)
  })
  const randomEmail = `${randomFullName.replace(/ /g, "")}${faker.number.int(
    1000
  )}@test.com`

  await pm.navigateTo().formLayoutsPage()
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      process.env.TESTUSERNAME,
      process.env.PASSWORD,
      "Option 2"
    )
  
  await page.screenshot({ path: "screenshots/formsLayoutsPage.png" })
  const buffer = await page.screenshot()
  // console.log(buffer.toString('base64'))

  await pm
    .onFormLayoutsPage()
    .submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
  await page
    .locator("nb-card", {
      hasText: "Inline form",
    })
    .screenshot({ path: "screenshots/inlineForm.png" })

  await pm.navigateTo().datePickerPage()
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10)
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)
})
