import { expect, test } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { NavigationPage } from "../page-objects/navigationPage"
import { FormLayoutsPage } from "../page-objects/formLayoutsPage"
import { DatePickerPage } from "../page-objects/datePickerPage"

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://localhost:4200/")
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

  await pm.navigateTo().formLayoutsPage()
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      "test@test.com",
      "Welcome1",
      "Option 2"
    )
  await pm
    .onFormLayoutsPage()
    .submitInLineFormWithNameEmailAndCheckbox(
      "John Smith",
      "john@test.com",
      true
    )

  await pm.navigateTo().datePickerPage()
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10)
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)
})
