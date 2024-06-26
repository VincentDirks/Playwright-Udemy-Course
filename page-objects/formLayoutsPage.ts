import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class FormLayoutsPage extends HelperBase{
  
  constructor(page: Page) {
    super(page)
  }

  async submitUsingTheGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionText: string
  ) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    })
    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email)
    await usingTheGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password)
    await usingTheGridForm
      .getByRole("radio", { name: optionText })
      .check({ force: true })

    await usingTheGridForm.getByRole("button").click()
  }

  /**
   * This method fills out the inline form with user details
   * 
   * @param name - first and last name
   * @param email - valid email for the test user
   * @param rememberMe - if the user session is to be saved
   */
  async submitInLineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline form",
    })
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name)
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email)

    rememberMe &&
      (await inlineForm.getByRole("checkbox").check({ force: true }))

    await inlineForm.getByRole("button").click()
  }
}
