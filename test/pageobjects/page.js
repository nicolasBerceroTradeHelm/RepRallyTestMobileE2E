/**
 * Base Page Object
 * Contains common methods shared across all page objects
 */
class Page {
    async waitForDisplayed(element, timeout = 10000) {
        await element.waitForDisplayed({ timeout });
    }

    async tap(element) {
        await this.waitForDisplayed(element);
        await element.click();
    }

    async enterText(element, text) {
        await this.waitForDisplayed(element);
        await element.clearValue();
        await element.setValue(text);
    }

    async getText(element) {
        await this.waitForDisplayed(element);
        return await element.getText();
    }

    async isDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async isExisting(element) {
        try {
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    async pause(ms = 1000) {
        await browser.pause(ms);
    }

    async takeScreenshot(filename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await browser.saveScreenshot(`./screenshots/${filename}-${timestamp}.png`);
    }

    async scrollToElement(element) {
        await element.scrollIntoView();
        await this.pause(500);
    }

    async swipe(direction = 'up', distance = 0.6) {
        await driver.execute('mobile: scrollGesture', {
            left: 100,
            top: 500,
            width: 800,
            height: 1500,
            direction: direction === 'up' ? 'down' : 'up', // Invertido
            percent: distance
        });
        
        await browser.pause(1000);
    }

    async waitForLoadingComplete(timeout = 10000) {
        await browser.pause(2000);
    }

    async handleAlert(action = 'accept') {
        try {
            await browser.pause(500);
            if (action === 'accept') {
                await driver.acceptAlert();
            } else {
                await driver.dismissAlert();
            }
        } catch (error) {
            console.log('No alert present');
        }
    }
}

module.exports = Page;