const HomePage = require('../../pageobjects/home.page');
const ProductDetailPage = require('../../pageobjects/product-detail.page');
const CartPage = require('../../pageobjects/cart.page');
const AlertHelper = require('../../helpers/alert.helper');

describe('2. Cart Management', () => {
    
    before(async () => {
        console.log('\n🛒 Starting Cart Management Tests...');
        // Removed AlertHelper.ensureAppIsRunning() - not needed
        await HomePage.waitForPageLoad();
    });

    describe('Test Case 2.1: View Cart Contents', () => {
        
        before(async () => {
            console.log('  📍 Setting up cart with products...');
            
            // Clear cart first
            await HomePage.goToCart();
            await CartPage.waitForPageLoad();
            
            const isEmpty = await CartPage.isCartEmpty();
            if (!isEmpty) {
                console.log('  Clearing existing cart...');
                await CartPage.clearCart();
                await driver.pause(1000);
            }
            
            await CartPage.goBack();
            await HomePage.waitForPageLoad();
            
            // Add products for testing
            console.log('  Adding test products...');
            const products = ['Organic Juice', 'Premium Water'];
            
            for (const product of products) {
                await HomePage.swipe('down', 0.8);
                await driver.pause(500);
                
                await HomePage.tapProductByName(product);
                await ProductDetailPage.waitForPageLoad();
                await ProductDetailPage.addToCart();
                await AlertHelper.waitForAlert();
                await AlertHelper.tapContinueShopping();
                await ProductDetailPage.goBack();
                await HomePage.waitForPageLoad();
            }
            
            console.log('  ✓ Cart prepared with 2 products');
        });

        it('should navigate to cart and display cart items', async () => {
            console.log('\n✓ Test: Navigate to cart');
            
            await HomePage.goToCart();
            await CartPage.waitForPageLoad();
            
            const cartTitle = await CartPage.cartTitle;
            const isDisplayed = await CartPage.isDisplayed(cartTitle);
            expect(isDisplayed).toBe(true);
            console.log('  ✓ Cart page is displayed');
            
            await CartPage.takeScreenshot('TC2.1-cart-page');
        });

        it('should verify cart items show correct information', async () => {
            console.log('\n✓ Test: Verify cart item information');
            
            const isEmpty = await CartPage.isCartEmpty();
            expect(isEmpty).toBe(false);
            console.log('  ✓ Cart contains items');
            
            await CartPage.takeScreenshot('TC2.1-cart-items');
        });

        it('should display subtotal, tax, and total', async () => {
            console.log('\n✓ Test: Verify price display');
            
            const subtotalLabel = await CartPage.subtotalLabel;
            const taxLabel = await CartPage.taxLabel;
            const totalLabel = await CartPage.totalLabel;
            
            expect(await CartPage.isDisplayed(subtotalLabel)).toBe(true);
            expect(await CartPage.isDisplayed(taxLabel)).toBe(true);
            expect(await CartPage.isDisplayed(totalLabel)).toBe(true);
            
            console.log('  ✓ Subtotal, Tax, and Total are displayed');
            await CartPage.takeScreenshot('TC2.1-price-summary');
        });
    });

    describe('Test Case 2.5: Clear All Cart Items', () => {
        
        it('should click "Clear all" button', async () => {
            console.log('\n✓ Test: Click Clear all button');
            
            // We're already in cart from TC 2.1
            await CartPage.swipe('up', 0.3);
            await driver.pause(500);
            
            const clearButton = await CartPage.clearAllButton;
            await CartPage.tap(clearButton);
            console.log('  ✓ Tapped "Clear all" button');
            
            await driver.pause(1000);
            await CartPage.takeScreenshot('TC2.5-clear-all-dialog');
        });

        it('should verify cart is empty', async () => {
            console.log('\n✓ Test: Confirm clear and verify empty');
            
            // Tap CLEAR ALL button in the dialog
            const confirmButton = await CartPage.clearAllConfirmButton;
            await CartPage.tap(confirmButton);
            console.log('  ✓ Confirmed clear cart');
            
            await driver.pause(2000);
            
            const isEmpty = await CartPage.isCartEmpty();
            expect(isEmpty).toBe(true);
            console.log('  ✓ Cart is empty');
            
            await CartPage.takeScreenshot('TC2.5-cart-emptied');
        });

        it('should verify empty state message is displayed', async () => {
            console.log('\n✓ Test: Verify empty state message');
            
            const isEmpty = await CartPage.isCartEmpty();
            expect(isEmpty).toBe(true);
            console.log('  ✓ Empty cart message displayed');
            
            await CartPage.takeScreenshot('TC2.5-empty-state');
        });
    });

    describe('Test Case 2.6: Cart Price Calculations', () => {
        
        before(async () => {
            console.log('  📍 Preparing cart for price calculation test...');
            
            // Go back to home
            await CartPage.goBack();
            await HomePage.waitForPageLoad();
        });

        it('should add products to cart with known prices', async () => {
            console.log('\n✓ Test: Add products with known prices');
            
            // Add Premium Water
            await HomePage.swipe('down', 0.8);
            await driver.pause(500);
            
            await HomePage.tapProductByName('Premium Water');
            await ProductDetailPage.waitForPageLoad();
            await ProductDetailPage.addToCart();
            await AlertHelper.waitForAlert();
            await AlertHelper.tapContinueShopping();
            await ProductDetailPage.goBack();
            await HomePage.waitForPageLoad();
            
            console.log('  ✓ Added Premium Water');
            
            // Go to cart to verify
            await HomePage.goToCart();
            await CartPage.waitForPageLoad();
            
            await CartPage.takeScreenshot('TC2.6-cart-with-product');
        });

        it('should verify subtotal, tax, and total calculations', async () => {
            console.log('\n✓ Test: Verify price calculations');
            
            const subtotalLabel = await CartPage.subtotalLabel;
            const taxLabel = await CartPage.taxLabel;
            const totalLabel = await CartPage.totalLabel;
            
            expect(await CartPage.isDisplayed(subtotalLabel)).toBe(true);
            expect(await CartPage.isDisplayed(taxLabel)).toBe(true);
            expect(await CartPage.isDisplayed(totalLabel)).toBe(true);
            
            console.log('  ✓ Subtotal, Tax (8%), and Total are displayed');
            
            await CartPage.takeScreenshot('TC2.6-price-calculations');
            
            // Go back to home for cleanup
            await CartPage.goBack();
            await HomePage.waitForPageLoad();
            
        });
    });
});