const Page = require('./page');

/**
 * Checkout Page Object
 * Handles interactions with the checkout screen
 */
class CheckoutPage extends Page {
    /**
     * Selectors for checkout page elements
     */
    get pageTitle() {
        return $('android=new UiSelector().text("Checkout")');
    }

    get backButton() {
        return $('android=new UiSelector().descriptionContains("Navigate up")');
    }

    // Store Information
    get storeNameLabel() {
        return $('android=new UiSelector().text("Store Name")');
    }

    get storeNameInput() {
        return $('android=new UiSelector().text("Enter store name")');
    }

    // Contact Information
    get fullNameLabel() {
        return $('android=new UiSelector().text("Full Name")');
    }

    get fullNameInput() {
        return $('android=new UiSelector().text("Enter your name")');
    }

    get emailLabel() {
        return $('android=new UiSelector().text("Email Address")');
    }

    get emailInput() {
        return $('android=new UiSelector().text("your.email@example.com")');
    }

    get phoneLabel() {
        return $('android=new UiSelector().text("Phone Number")');
    }

    get phoneInput() {
        return $('android=new UiSelector().text("(555) 123-4567")');
    }

    // Order Summary
    get orderSummaryTitle() {
        return $('android=new UiSelector().text("Order Summary")');
    }

    get subtotalLabel() {
        return $('android=new UiSelector().text("Subtotal")');
    }

    get taxLabel() {
        return $('android=new UiSelector().text("Tax")');
    }

    get totalLabel() {
        return $('android=new UiSelector().text("Total")');
    }

    get placeOrderButton() {
        return $('android=new UiSelector().descriptionContains("Place Order")');
    }

    get demoCheckoutBanner() {
        return $('android=new UiSelector().textContains("This is a demo checkout")');
    }

    // Validation Dialog Selectors
    get missingInfoDialog() {
        return $('android=new UiSelector().text("Missing Information")');
    }

    get nameValidationDialog() {
        return $('android=new UiSelector().textContains("enter your name")');
    }

    get emailValidationDialog() {
        return $('android=new UiSelector().textContains("enter your email")');
    }

    get phoneValidationDialog() {
        return $('android=new UiSelector().textContains("phone number")');
    }

    get validationOkButton() {
        return $('android=new UiSelector().text("OK")');
    }

    // Success Dialog Selectors
    get orderSuccessDialog() {
        return $('android=new UiSelector().textContains("Order Placed Successfully")');
    }

    get orderDetailsText() {
        return $('android=new UiSelector().textContains("Order #ORD")');
    }

    get successOkButton() {
        return $('android=new UiSelector().text("OK")');
    }

    // Developer Menu
    get continueButton() {
        return $('android=new UiSelector().text("Continue")');
    }

    /**
     * Wait for checkout page to load
     */
    async waitForPageLoad() {
        await this.waitForDisplayed(this.pageTitle, 10000);
        await this.pause(1500);
    }

    /**
     * Dismiss developer menu if present
     */
    async dismissDeveloperMenu() {
        try {
            if (await this.isDisplayed(this.continueButton)) {
                await this.tap(this.continueButton);
                await this.pause(1000);
                console.log('  ✓ Dismissed developer menu');
            }
        } catch (error) {
            // No developer menu, continue
        }
    }

    /**
     * Check if store name field is present
     */
    async hasStoreNameField() {
        return await this.isDisplayed(this.storeNameInput);
    }

    /**
     * Check if contact name field is present
     */
    async hasContactNameField() {
        return await this.isDisplayed(this.fullNameInput);
    }

    /**
     * Check if email field is present
     */
    async hasEmailField() {
        return await this.isDisplayed(this.emailInput);
    }

    /**
     * Check if phone field is present
     */
    async hasPhoneField() {
        return await this.isDisplayed(this.phoneInput);
    }

    /**
     * Fill store name field
     */
    async fillStoreName(storeName) {
        await this.enterText(this.storeNameInput, storeName);
        console.log(`  ✓ Filled store name: ${storeName}`);
    }

    /**
     * Fill contact name field
     */
    async fillContactName(name) {
        await this.enterText(this.fullNameInput, name);
        console.log(`  ✓ Filled contact name: ${name}`);
    }

    /**
     * Fill email field
     */
    async fillEmail(email) {
        await this.enterText(this.emailInput, email);
        console.log(`  ✓ Filled email: ${email}`);
    }

    /**
     * Fill phone field
     */
    async fillPhone(phone) {
        await this.enterText(this.phoneInput, phone);
        console.log(`  ✓ Filled phone: ${phone}`);
    }

    /**
     * Tap Place Order button
     */
    async tapPlaceOrder() {
        await this.swipe('up', 0.5);
        await this.pause(500);
        
        await this.tap(this.placeOrderButton);
        console.log('  ✓ Tapped "Place Order" button');
    }

    /**
     * Get order summary details
     */
    async getOrderSummary() {
        try {
            const allPrices = await $$('android=new UiSelector().textMatches("^\\$\\d+\\.\\d{2}$")');
            
            let subtotal = '';
            let tax = '';
            let total = '';
            
            if (allPrices.length >= 3) {
                subtotal = await allPrices[allPrices.length - 3].getText();
                tax = await allPrices[allPrices.length - 2].getText();
                total = await allPrices[allPrices.length - 1].getText();
            }
            
            return { subtotal, tax, total };
        } catch (error) {
            console.log('  ⚠ Could not read order summary:', error.message);
            return { subtotal: '', tax: '', total: '' };
        }
    }

    /**
     * Check for validation dialog and dismiss it
     */
    async handleValidationDialog(dialogType = 'missing') {
        try {
            let dialogElement;
            
            switch (dialogType) {
                case 'missing':
                    dialogElement = this.missingInfoDialog;
                    break;
                case 'name':
                    dialogElement = this.nameValidationDialog;
                    break;
                case 'email':
                    dialogElement = this.emailValidationDialog;
                    break;
                case 'phone':
                    dialogElement = this.phoneValidationDialog;
                    break;
                default:
                    dialogElement = this.missingInfoDialog;
            }
            
            const isDisplayed = await this.isDisplayed(dialogElement);
            
            if (isDisplayed) {
                console.log(`  ✓ Validation dialog shown: ${dialogType}`);
                await this.takeScreenshot(`validation-${dialogType}`);
                
                await this.tap(this.validationOkButton);
                await this.pause(1000);
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check for and handle success dialog
     */
    async handleSuccessDialog() {
        try {
            const isDisplayed = await this.isDisplayed(this.orderSuccessDialog);
            
            if (isDisplayed) {
                console.log('  ✅ Order Placed Successfully dialog shown!');
                
                // Get order details if available
                try {
                    const orderText = await this.getText(this.orderDetailsText);
                    console.log(`  ✓ Order confirmation: ${orderText}`);
                } catch (e) {
                    // Order details not found, that's ok
                }
                
                await this.takeScreenshot('order-success');
                
                await this.tap(this.successOkButton);
                await this.pause(2000);
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Go back to previous page
     */
    async goBack() {
        await this.tap(this.backButton);
        await this.waitForLoadingComplete();
    }
}

module.exports = new CheckoutPage();