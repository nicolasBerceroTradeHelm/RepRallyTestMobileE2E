const Page = require('../pageobjects/page');

/**
 * Alert Helper
 * Handles alert dialogs and confirmations throughout the app
 */
class AlertHelper extends Page {
    
    /**
     * Alert selectors
     */
    get alertTitle() {
        return $('android=new UiSelector().resourceId("android:id/alertTitle")');
    }

    get alertMessage() {
        return $('android=new UiSelector().resourceId("android:id/message")');
    }

    get continueShoppingButton() {
        return $('android=new UiSelector().text("CONTINUE SHOPPING")');
    }

    get viewCartButton() {
        return $('android=new UiSelector().text("VIEW CART")');
    }

    get okButton() {
        return $('android=new UiSelector().text("OK")');
    }

    /**
     * Wait for alert to appear
     * @param {number} timeout - Wait timeout in ms
     */
    async waitForAlert(timeout = 5000) {
        try {
            await this.waitForDisplayed(this.alertMessage, timeout);
            await this.pause(500);
            return true;
        } catch (error) {
            console.log('  ⚠ Alert did not appear within timeout');
            return false;
        }
    }

    /**
     * Check if "Added to Cart" alert is displayed
     * @returns {Promise<boolean>}
     */
    async isAddedToCartAlertDisplayed() {
        try {
            const message = await this.alertMessage;
            const isDisplayed = await this.isDisplayed(message);
            
            if (isDisplayed) {
                const text = await message.getText();
                return text.toLowerCase().includes('added to cart');
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get alert message text
     * @returns {Promise<string>}
     */
    async getAlertMessage() {
        try {
            const message = await this.alertMessage;
            return await message.getText();
        } catch (error) {
            return '';
        }
    }

    /**
     * Tap "Continue Shopping" button
     */
    async tapContinueShopping() {
        try {
            await this.tap(this.continueShoppingButton);
            console.log('  ✓ Tapped "Continue Shopping"');
            await this.pause(1000);
        } catch (error) {
            console.log('  ⚠ Could not tap Continue Shopping button');
        }
    }

    /**
     * Tap "View Cart" button
     */
    async tapViewCart() {
        try {
            await this.tap(this.viewCartButton);
            console.log('  ✓ Tapped "View Cart"');
            await this.pause(1000);
        } catch (error) {
            console.log('  ⚠ Could not tap View Cart button');
        }
    }

    /**
     * Dismiss alert by tapping OK
     */
    async dismissAlert() {
        try {
            await this.tap(this.okButton);
            console.log('  ✓ Dismissed alert');
            await this.pause(500);
        } catch (error) {
            console.log('  ⚠ Could not dismiss alert');
        }
    }

    /**
     * Ensure the app is running and in a good state
     */
    static async ensureAppIsRunning() {
        try {
            await driver.pause(1000);
            
            // Check if app is running by looking for current package
            const appPackage = await driver.getCurrentPackage();
            console.log(`  ✓ App is running: ${appPackage}`);
            
            return true;
        } catch (error) {
            console.log('  ⚠ App not running, attempting to restart...');
            
            try {
                // Restart the app
                await driver.terminateApp('com.agicent.zeusone');
                await driver.pause(1000);
                await driver.activateApp('com.agicent.zeusone');
                await driver.pause(3000);
                
                console.log('  ✓ App restarted successfully');
                return true;
            } catch (restartError) {
                console.log('  ✗ Failed to restart app:', restartError.message);
                return false;
            }
        }
    }
}

module.exports = new AlertHelper();