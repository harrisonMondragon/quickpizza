import { browser } from "k6/experimental/browser";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3333";

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async function () {
  const page = browser.newPage(); // open new page

  try {
    await page.goto(BASE_URL); 
    check(page, {
      header:
        page.locator("h1").textContent() ==
        "Looking to break out of your pizza routine?",
    });

    await page.locator('//button[. = "Pizza, Please!"]').click(); // select matching element and automate generating pizza
    page.waitForTimeout(500);
    page.screenshot({ path: "Screenshots/generate-pizza-screenshot.png" });
    check(page, {
      recommendation: page.locator("div#recommendations").textContent() != "",
    });  // confirm that the pizza recommendations are visable on the page
  } finally {
    page.close();
  }
}
