// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  "default e2e tests": browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible("#app", 5000)
      .assert.elementPresent(".hello")
      .assert.containsText("h1", "Welcome to Your Vue.js App")
      .end();
  }
};
