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
  thresholds: {
    browser_web_vital_fcp: ["p(95) < 1800"],
    browser_web_vital_lcp: ["p(95) < 2500"],
    browser_web_vital_cls: ["p(95) < 0.1"]
  }
};
// fcp - Measures the time it takes for the browser to render the first DOM element on the page. To provide a good user experience, sites must have an FCP of 1.8 seconds or less.
// lcp - Measures a page's loading performance. To provide a good user experience, sites should strive to have LCP of 2.5 seconds or less
// cls - Measures a page's visual stability. To provide a good user experience, a site must have a CLS score of 0.1 or less.

export default async function () {
  const page = browser.newPage();

  try {
    await page.goto(BASE_URL);
    check(page, {
      header:
        page.locator("h1").textContent() ==
        "Looking to break out of your pizza routine?",
    });

    await page.locator('//button[. = "Pizza, Please!"]').click();
    page.waitForTimeout(500);
    page.screenshot({ path: "screenshot.png" });
    check(page, {
      recommendation: page.locator("div#recommendations").textContent() != "",
    });
  } finally {
    page.close();
  }
}
