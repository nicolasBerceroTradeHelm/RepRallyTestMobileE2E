const Page = require('./page');

/**
 * Cart Page Object
 * Handles interactions with the shopping cart screen
 */
class CartPage extends Page {
    get cartTitle() {
        return $('android=new UiSelector().text("Cart")');
    }

    get emptyCartMessage() {
        return $('android=new UiSelector().textContains("empty")');
    }

    get clearAllButton() {
        return $('android=new UiSelector().text("Clear all")');
    }

    get clearAllConfirmButton() {
        return $('android=new UiSelector().text("CLEAR ALL")');
    }

    get cancelButton() {
        return $('android=new UiSelector().text("CANCEL")');
    }

    get backButton() {
        return $('android=new UiSelector().descriptionContains("Navigate up")');
    }

    get proceedToCheckoutButton() {
        return $('android=new UiSelector().text("Proceed to Checkout")');
    }

    get subtotalLabel() {
        return $('android=new UiSelector().text("Subtotal")');
    }

    get taxLabel() {
        return $('android=new UiSelector().text("Tax (8%)")');
    }

    get totalLabel() {
        return $('android=new UiSelector().text("Total")');
    }

    /**
     * Clear all items from cart
     */
    async clearCart() {
        try {
            console.log('  🧹 Clearing cart...');
            
            // Scroll down to find Clear all button
            await this.swipe('up', 0.3);
            await driver.pause(500);
            
            const clearButton = await this.clearAllButton;
            if (await this.isDisplayed(clearButton)) {
                await this.tap(clearButton);
                console.log('  ✓ Tapped "Clear all" button');
                
                // Wait for confirmation dialog
                await driver.pause(1000);
                
                // Tap CLEAR ALL on confirmation dialog
                const confirmButton = await this.clearAllConfirmButton;
                if (await this.isDisplayed(confirmButton)) {
                    await this.tap(confirmButton);
                    console.log('  ✓ Confirmed clear cart');
                    await driver.pause(1000);
                }
                
                console.log('  ✓ Cart cleared');
                return true;
            }
        } catch (error) {
            console.log('  ⚠ Could not clear cart:', error.message);
            return false;
        }
    }

    /**
     * Check if cart is empty
     * @returns {Promise<boolean>} True if cart is empty
     */
    async isCartEmpty() {
        try {
            return await this.isDisplayed(this.emptyCartMessage);
        } catch (error) {
            return false;
        }
    }

    /**
     * Navigate back to home
     */
    async goBack() {
        await this.tap(this.backButton);
        await this.waitForLoadingComplete();
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout() {
        // Scroll down to find button
        await this.swipe('up', 0.5);
        await driver.pause(500);
        
        await this.tap(this.proceedToCheckoutButton);
        await this.waitForLoadingComplete();
    }

    /**
     * Wait for cart page to load
     */
    async waitForPageLoad() {
        await this.waitForDisplayed(this.cartTitle, 10000);
        await this.pause(1000);
    }
}

module.exports = new CartPage();