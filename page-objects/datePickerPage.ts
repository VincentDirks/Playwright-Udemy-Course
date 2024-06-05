import { Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatePickerPage extends HelperBase {
  constructor(page: Page) {
    super(page)
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calendarInputfield = this.page.getByPlaceholder("Form Picker")
    await calendarInputfield.click()

    const formattedSelectDate = await this.selectDateInTheCalendar(
      numberOfDaysFromToday
    )

    await expect(calendarInputfield).toHaveValue(formattedSelectDate)
  }

  async selectDatePickerWithRangeFromToday(
    startDayFromToday: number,
    endDayFromToday: number
  ) {
    if (startDayFromToday > endDayFromToday)
      throw new Error("startDayFromToday must not be after endDayFromToday")

    const calendarInputfield = this.page.getByPlaceholder("Range Picker")
    await calendarInputfield.click()

    const formattedStartDate = await this.selectDateInTheCalendar(
      startDayFromToday
    )
    const formattedEndDate = await this.selectDateInTheCalendar(endDayFromToday)

    await expect(calendarInputfield).toHaveValue(
      `${formattedStartDate} - ${formattedEndDate}`
    )
  }

  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    let selectDate = new Date()
    selectDate.setDate(selectDate.getDate() + numberOfDaysFromToday)
    const selectDayOfMonth = selectDate.getDate().toString() // value of "1" to "31"
    const selectMonth = selectDate.toLocaleString("En-US", { month: "short" })
    const selectYear = selectDate.getFullYear().toString()
    const formattedSelectDate = `${selectMonth} ${selectDayOfMonth}, ${selectYear}`

    // check if selectDate is in this month, or whether we need to click next to a future month
    for (let i = 0; i < numberOfDaysFromToday / 28; i++) {
      // divide by shortest month
      let calendarMonthAndYear = await this.page
        .locator("nb-calendar-view-mode")
        .textContent()

      if (
        calendarMonthAndYear.includes(selectMonth) &&
        calendarMonthAndYear.includes(selectYear)
      ) {
        break
      } else {
        await this.page.locator(".next-month").click()
      }
    }

    await this.page
      .locator(".day-cell.ng-star-inserted:not(.bounding-month)")
      .getByText(selectDayOfMonth, { exact: true })
      .click()
    // locator has to be exact match, partial matches would include days from prev and next months

    return formattedSelectDate
  }
}
