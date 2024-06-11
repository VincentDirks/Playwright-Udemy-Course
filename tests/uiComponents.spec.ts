import { test, expect } from "@playwright/test"

test.describe.configure({ mode: "parallel" })

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("/")
})

test.describe.parallel("Forms Layouts page", () => {
  test.describe.configure({ retries: 2 })

  test.beforeEach(async ({ page }, testInfo) => {
    if (testInfo.retry) {
      // do any clean up from previous failed attempt
    }

    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
  })

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" })

    await usingTheGridEmailInput.fill("test@test.com")
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially(
      "test2@test.com"
      //      ,{delay: 500,}
    )

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue()
    expect(inputValue).toEqual("test2@test.com")

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com")
  })

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    })

    //await usingTheGridForm.getByLabel('Option 1').check({force:true})
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true })

    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked()
    expect(radioStatus).toBeTruthy()

    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked()

    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true })

    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy()
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy()
  })
})

test("checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click()
  await page.locator(".menu-item").getByText("Toastr").click()
  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true })
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true })

  const checkBoxes = page.getByRole("checkbox")
  for (const checkbox of await checkBoxes.all()) {
    await checkbox.uncheck({ force: true })
    expect(await checkbox.isChecked()).toBeFalsy()
  }
})

test("lists and dropdowns", async ({ page }) => {
  const dropDownMenu = page.locator("ngx-header nb-select")
  await dropDownMenu.click()

  page.getByRole("list") // for <ul> => parent list container
  page.getByRole("listitem") // for <li> => not always used

  // const optionList = page.getByRole('list').locator('nb-option')

  const optionList = page.locator("nb-option-list nb-option")

  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

  await optionList.filter({ hasText: "Cosmic" }).click()

  const header = page.locator("nb-layout-header")
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)")

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  }

  for (const color in colors) {
    await dropDownMenu.click()
    await optionList.filter({ hasText: color }).click()
    await expect(header).toHaveCSS("background-color", colors[color])
  }
})

test("tooltip", async ({ page }) => {
  await page.getByText("Modal & Overlays").click()
  await page.locator(".menu-item").getByText("Tooltip").click()
  const toolTipCard = page.locator("nb-card", { hasText: "Tooltip Placements" })
  await toolTipCard.locator("button", { hasText: "TOP" }).hover()

  page.getByRole("tooltip") // only works if the tooltip role was added to the element
  const tooltip = await page.locator("nb-tooltip").textContent()
  expect(tooltip).toEqual("This is a tooltip")
})

test("Dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click()
  await page.locator(".menu-item").getByText("Smart Table").click()

  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?")
    dialog.accept()
  })

  const email = "mdo@gmail.com"
  await page
    .getByRole("table")
    .locator("tr", { hasText: email })
    .locator(".nb-trash")
    .click()

  await expect(page.locator("table tr").first()).not.toHaveText(email)
})

test("Web Table", async ({ page }) => {
  await page.getByText("Tables & Data").click()
  await page.locator(".menu-item").getByText("Smart Table").click()

  // 1 locate a row by a unique value
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" })
  await targetRow.locator(".nb-edit").click()
  await page.locator("input-editor").getByPlaceholder("Age").clear()
  await page.locator("input-editor").getByPlaceholder("Age").fill("35")
  await page.locator(".nb-checkmark").click()

  // 2 get a row by a value in specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click()
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") })
  await targetRowById.locator(".nb-edit").click()
  await page.locator("input-editor").getByPlaceholder("E-mail").clear()
  await page
    .locator("input-editor")
    .getByPlaceholder("E-Mail")
    .fill("test@test.com")
  await page.locator(".nb-checkmark").click()
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com")

  // Part 2
  // 3 test filter of the  table
  const ages = ["20", "30", "40", "200"]

  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear()
    await page.locator("input-filter").getByPlaceholder("Age").fill(age)
    await page.waitForTimeout(500) // it takes a moment to refresh the list

    const ageRows = page.locator("tbody tr")

    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent()
      if (age == "200") {
        expect(await page.getByRole("table").textContent()).toContain(
          "No data found"
        )
      } else {
        expect(cellValue).toEqual(age)
      }
    }
  }
})

test("Date Picker", async ({ page }) => {
  await page.getByText("Forms").click()
  await page.locator(".menu-item").getByText("Datepicker").click()

  const calendarInputfield = page.getByPlaceholder("Form Picker")
  await calendarInputfield.click()

  let selectDate = new Date()
  const addDays = 500
  selectDate.setDate(selectDate.getDate() + addDays)
  const selectDayOfMonth = selectDate.getDate().toString() // value of "1" to "31"
  const selectMonth = selectDate.toLocaleString("En-US", { month: "short" })
  const selectYear = selectDate.getFullYear().toString()
  const formattedSelectDate = `${selectMonth} ${selectDayOfMonth}, ${selectYear}`

  for (let i = 0; i < addDays / 28; i++) {
    // divide by shortest month
    let calendarMonthAndYear = await page
      .locator("nb-calendar-view-mode")
      .textContent()

    if (
      calendarMonthAndYear.includes(selectMonth) &&
      calendarMonthAndYear.includes(selectYear)
    ) {
      break
    } else {
      await page.locator(".next-month").click()
    }
  }

  await page
    // .locator('[class="day-cell ng-star-inserted"]') // this uses exact match, partial matches would include days from prev and next months

    .locator(".day-cell.ng-star-inserted:not(.bounding-month)")
    // this is better because it matches for both single date picker as well as the date range picker

    .getByText(selectDayOfMonth, { exact: true })
    .click()

  await expect(calendarInputfield).toHaveValue(formattedSelectDate)
})

test("Sliders", async ({ page }) => {
  // Update attribute
  // const tempGaugeDraggerHandle = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  // await tempGaugeDraggerHandle.evaluate(node => {
  //     node.setAttribute('cx',"232.103")
  //     node.setAttribute('cy',"232.103")
  // })
  // await tempGaugeDraggerHandle.click()

  // mouse movement
  const tempGauge = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger'
  )

  tempGauge.scrollIntoViewIfNeeded()
  // probably also need to make sure that the bowser window is big enough to show the whole UI control

  const box = await tempGauge.boundingBox()

  const c = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }

  await page.screenshot({
    path: "screenshots/sliderBefore.png",
    caret: "initial",
  })

  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 100, c.y)
  await page.mouse.move(c.x + 100, c.y + 100)
  await page.mouse.up()
  await page.screenshot({
    path: "screenshots/sliderAfterDrag.png",
    caret: "initial",
  })

  await page.mouse.click(c.x + 100, c.y + 100)
  // this was needed to get the scenario to run in Playwright UI mode viewer
  await page.screenshot({
    path: "screenshots/sliderAfterClick.png",
    caret: "initial",
  })

  await expect(tempGauge).toContainText("12")
})
