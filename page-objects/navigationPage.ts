import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page)
  }

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms")
    await this.page.getByText("Form Layouts").click()
  }

  async datePickerPage() {
    await this.selectGroupMenuItem("Forms")
    await this.page.locator(".menu-item").getByText("Datepicker").click()
  }

  async smartTablepage() {
    await this.selectGroupMenuItem("Tables & Data")
    await this.page.locator(".menu-item").getByText("Smart Table").click()
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays")
    await this.page.locator(".menu-item").getByText("Toastr").click()
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays")
    await this.page.locator(".menu-item").getByText("Tooltip").click()
  }

  // helper methods
  private async selectGroupMenuItem(groupItemtitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemtitle)
    const expandedState = await groupMenuItem.getAttribute("aria-expanded")

    if (expandedState == "false") {
      await groupMenuItem.click()
    }
  }
}
