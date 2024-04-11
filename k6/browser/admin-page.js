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

export default async function () {
  const page = browser.newPage(); // open new page

  try {
    await page.goto(BASE_URL); 
    check(page, {
      header:
        page.locator("h1").textContent() ==
        "Looking to break out of your pizza routine?",
    });

    await page.locator('//a[. = "Click here"]').click(); // go to the admin page
    page.waitForTimeout(500);
    page.screenshot({ path: "Screenshots/admin-screenshot.png" });
    check(page, {
      "Admin page text": page.locator("h1").textContent() == "QuickPizza Administration",
    });  // confirm that were on the admin page

    await page.locator('button[type="submit"]').click(); // sign in to admin
    page.screenshot({ path: "Screenshots/admin-login.png" });
    check(page, {
      "Logout button text": page.locator('//*[text()="Logout"]').textContent() == "Logout",
    });

  } finally {
    page.close();
  }
}
