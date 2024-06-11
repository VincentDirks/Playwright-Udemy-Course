import { test } from "../test-options"
import { faker } from "@faker-js/faker"

//test("parameterised methods", async ({ page, formLayoutsPage }) => { // without {auto:true} in fixture
//test("parameterised methods", async ({ page }) => { // without using new pageManager fixture
test("parameterised methods", async ({ pageManager }) => {
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(/ /g, "")}${faker.number.int(
    1000
  )}@test.com`

  await pageManager
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      process.env.TESTUSERNAME,
      process.env.PASSWORD,
      "Option 2"
    )

  await pageManager
    .onFormLayoutsPage()
    .submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})
