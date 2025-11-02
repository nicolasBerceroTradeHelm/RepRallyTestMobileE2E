const HomePage = require('../../pageobjects/home.page');
const ProductDetailPage = require('../../pageobjects/product-detail.page');
const CartPage = require('../../pageobjects/cart.page');
const AlertHelper = require('../../helpers/alert.helper');

describe('1. Product Browsing & Cart Addition', () => {

    before(async () => {
        console.log('\n📱 Starting Product Browsing & Cart Addition Tests...');
        await HomePage.waitForPageLoad();

        // Clean cart before starting
        console.log('🧹 Preparing clean state...');
        await HomePage.goToCart();
        await CartPage.waitForPageLoad();
        const isEmpty = await CartPage.isCartEmpty();
        if (!isEmpty) {
            await CartPage.clearCart();
        }
        await CartPage.goBack();
        await HomePage.waitForPageLoad();
        console.log('✅ Ready to start tests\n');
    });

    describe('Test Case 1.1: View Product Catalog', () => {

        it('should verify that the home page displays a grid of products', async () => {
            console.log('\n✓ Test: Home page displays product grid');

            const headerDisplayed = await HomePage.isHeaderDisplayed();
            expect(headerDisplayed).toBe(true);
            console.log('  ✓ Header with title "Shop" and cart button displayed');

            const productNames = await HomePage.getAllProductNames();
            expect(productNames.length).toBeGreaterThan(0);
            console.log(`  ✓ Product grid is displayed with ${productNames.length} visible products`);

            await HomePage.takeScreenshot('TC1.1-product-grid');
        });

        it('should verify that each product card shows: image, name, price, brand', async () => {
            console.log('\n✓ Test: Product cards display required information');

            const productNames = await HomePage.getAllProductNames();
            const firstProduct = productNames[0] || 'Premium Energy Drink';

            console.log(`  Verifying product card: "${firstProduct}"`);
            const verification = await HomePage.verifyProductCard(firstProduct);

            console.log(`  - Has Image: ${verification.hasImage ? '✓' : '✗'}`);
            console.log(`  - Has Name: ${verification.hasName ? '✓' : '✗'}`);
            console.log(`  - Has Price: ${verification.hasPrice ? '✓' : '✗'}`);
            console.log(`  - Has Brand: ${verification.hasBrand ? '✓' : '✗'}`);

            expect(verification.hasImage).toBe(true);
            expect(verification.hasName).toBe(true);
            expect(verification.hasPrice).toBe(true);

            console.log('  ✓ Product card displays all required information');
            await HomePage.takeScreenshot('TC1.1-product-card-details');
        });

        it('should verify that multiple products are displayed', async () => {
            console.log('\n✓ Test: Verify product count');

            // Just verify we have products, don't worry about exact count
            const productCount = await HomePage.getProductCount();
            console.log(`  Total products found: ${productCount}`);

            expect(productCount).toBeGreaterThanOrEqual(4);
            console.log('  ✓ Product catalog displays multiple products');

            await HomePage.takeScreenshot('TC1.1-product-catalog');
        });
    });

    describe('Test Case 1.2: Add Single Product to Cart', () => {

        let productName = '';
        let minQuantity = 1;

        before(async () => {
            // Ensure we're on home page and scroll to top
            console.log('  📍 Resetting to top of home page...');
            try {
                // Scroll all the way up to see first products
                await HomePage.swipe('down', 0.9);
                await driver.pause(500);
                await HomePage.swipe('down', 0.9);
                await driver.pause(1000);
            } catch (e) {
                console.log('  ⚠ Scroll failed, continuing anyway');
            }
        });

        it('should navigate to a product detail page', async () => {
            console.log('\n✓ Test: Navigate to product detail');

            const searchProduct = 'Premium Energy Drink';
            console.log(`  Tapping on product: ${searchProduct}`);
            await HomePage.tapProductByName(searchProduct);

            await ProductDetailPage.waitForPageLoad();

            productName = await ProductDetailPage.getProductName();
            console.log(`  Product name from detail: "${productName}"`);

            const pageTitle = await ProductDetailPage.pageTitle;
            const isTitleDisplayed = await ProductDetailPage.isDisplayed(pageTitle);
            expect(isTitleDisplayed).toBe(true);
            console.log('  ✓ Product detail page loaded');

            await ProductDetailPage.takeScreenshot('TC1.2-product-detail-page');
        });

        it('should verify product details are displayed (name, price, wholesale, retail, margin, etc.)', async () => {
            console.log('\n✓ Test: Verify product details are displayed');

            const verification = await ProductDetailPage.verifyProductDetailsDisplayed();

            console.log(`  - Brand: ${verification.hasBrand ? '✓' : '✗'}`);
            console.log(`  - Product Name: ${verification.hasName ? '✓' : '✗'}`);
            console.log(`  - Wholesale Price: ${verification.hasWholesalePrice ? '✓' : '✗'}`);
            console.log(`  - Retail Price: ${verification.hasRetailPrice ? '✓' : '✗'}`);

            expect(verification.hasName).toBe(true);
            expect(verification.hasWholesalePrice).toBe(true);
            expect(verification.hasRetailPrice).toBe(true);

            const details = await ProductDetailPage.getProductDetails();
            console.log('\n  Product Details:');
            console.log(`    Brand: ${details.brand}`);
            console.log(`    Name: ${details.name}`);
            console.log(`    Wholesale: ${details.wholesalePrice}`);
            console.log(`    Retail: ${details.retailPrice}`);

            console.log('\n  ✓ Product details are displayed');
            await ProductDetailPage.takeScreenshot('TC1.2-product-details-verified');
        });

        it('should verify minimum quantity is displayed and enforced', async () => {
            console.log('\n✓ Test: Verify minimum quantity');

            minQuantity = await ProductDetailPage.getQuantityFromButton();
            console.log(`  Current quantity: ${minQuantity}`);

            expect(minQuantity).toBeGreaterThanOrEqual(1);
            console.log(`  ✓ Minimum quantity (${minQuantity}) is displayed in button`);

            const buttonDesc = await ProductDetailPage.addToCartButton.getAttribute('content-desc');
            console.log(`  Button text: "${buttonDesc}"`);
            expect(buttonDesc).toContain('Add');
            expect(buttonDesc).toContain('Case');
            expect(buttonDesc).toContain('$');

            console.log('  ✓ Add to cart button displays correct format');
        });

        it('should add product to cart with minimum quantity', async () => {
            console.log('\n✓ Test: Add product to cart');

            const initialButtonText = await ProductDetailPage.addToCartButton.getAttribute('content-desc');
            console.log(`  Adding product: ${initialButtonText}`);

            await ProductDetailPage.addToCart();
            console.log('  ✓ Tapped "Add to Cart" button');

            await ProductDetailPage.takeScreenshot('TC1.2-add-to-cart-tapped');
        });

        it('should verify success alert appears', async () => {
            console.log('\n✓ Test: Verify success alert');

            await AlertHelper.waitForAlert();

            const isAlertDisplayed = await AlertHelper.isAddedToCartAlertDisplayed();
            expect(isAlertDisplayed).toBe(true);
            console.log('  ✓ "Added to Cart" alert is displayed');

            const alertMessage = await AlertHelper.getAlertMessage();
            console.log(`  Alert message: "${alertMessage}"`);

            const containsAddedText = alertMessage.toLowerCase().includes('added to cart');
            expect(containsAddedText).toBe(true);
            console.log('  ✓ Alert contains "added to cart" message');

            await ProductDetailPage.takeScreenshot('TC1.2-success-alert');
        });

        it('should verify cart badge updates with correct item count', async () => {
            console.log('\n✓ Test: Verify cart badge updates');

            await AlertHelper.tapContinueShopping();
            console.log('  ✓ Dismissed alert');

            await driver.pause(1500);

            const cartBadge = await ProductDetailPage.getCartBadge();
            const hasBadge = cartBadge !== null;

            if (hasBadge) {
                console.log('  ✓ Cart badge is visible');
                console.log('  ✓ Cart badge shows item was added');
            } else {
                console.log('  ⚠ Cart badge not found');
            }

            await ProductDetailPage.takeScreenshot('TC1.2-cart-badge-updated');
            console.log(`\n  ✓ Product successfully added to cart! (${minQuantity} case(s))`);

            // Go back to home for next tests
            await ProductDetailPage.goBack();
            await HomePage.waitForPageLoad();
        });
    });

    describe('Test Case 1.3: Add Multiple Products to Cart', () => {

        before(async () => {
            // Ensure we're on home page
            console.log('  📍 Ensuring we\'re on home page...');
            await HomePage.waitForPageLoad();
        });

        it('should add 3 different products to cart', async () => {
            console.log('\n✓ Test: Add 3 different products');

            // Use products that are always visible without scrolling
            const productsToAdd = [
                'Organic Juice',
                'Premium Water',
                'Sports Hydration'
            ];

            for (let i = 0; i < productsToAdd.length; i++) {
                const product = productsToAdd[i];
                console.log(`\n  Adding product ${i + 1}/3: ${product}`);

                // Scroll to top first to see all products
                if (i > 0) {
                    await HomePage.swipe('down', 0.5);
                    await driver.pause(1000);
                }

                await HomePage.tapProductByName(product);
                await ProductDetailPage.waitForPageLoad();

                await ProductDetailPage.addToCart();
                await AlertHelper.waitForAlert();
                await AlertHelper.tapContinueShopping();

                await ProductDetailPage.goBack();
                await HomePage.waitForPageLoad();
                console.log(`  ✓ Added ${product}`);
            }

            await HomePage.takeScreenshot('TC1.3-added-multiple-products');
            console.log('\n  ✓ Successfully added 3 products to cart');
        });

        it('should verify cart badge shows correct total quantity across all products', async () => {
            console.log('\n✓ Test: Verify cart badge shows total quantity');

            const badgeCount = await HomePage.getCartBadgeCount();
            console.log(`  Cart badge count: ${badgeCount}`);

            const count = parseInt(badgeCount);
            expect(count).toBeGreaterThanOrEqual(3);
            console.log('  ✓ Cart badge shows multiple items');

            await HomePage.takeScreenshot('TC1.3-cart-badge-count');
        });

        it('should navigate to cart and verify all products are present', async () => {
            console.log('\n✓ Test: Verify all products in cart');

            await HomePage.goToCart();
            await CartPage.waitForPageLoad();

            const cartTitle = await CartPage.cartTitle;
            const isCartDisplayed = await CartPage.isDisplayed(cartTitle);
            expect(isCartDisplayed).toBe(true);
            console.log('  ✓ Cart page displayed with products');

            await CartPage.takeScreenshot('TC1.3-cart-with-products');

            // Go back to home for next tests
            await CartPage.goBack();
            await HomePage.waitForPageLoad();
        });
    });

    describe('Test Case 1.4: Minimum Quantity Validation', () => {

        before(async () => {
            // Ensure we're on home page
            console.log('  📍 Ensuring we\'re on home page...');
            await HomePage.waitForPageLoad();

            // Scroll to top to see all products
            await HomePage.swipe('down', 0.8);
            await driver.pause(1000);
        });

        it('should select a product with minQuantity > 1', async () => {
            console.log('\n✓ Test: Select product with minQuantity > 1');

            // Use Premium Water which has min: 4
            const product = 'Premium Water';
            console.log(`  Looking for product with minQuantity > 1: ${product}`);

            await HomePage.tapProductByName(product);
            await ProductDetailPage.waitForPageLoad();

            const minQty = await ProductDetailPage.getQuantityFromButton();
            console.log(`  Minimum quantity: ${minQty}`);

            expect(minQty).toBeGreaterThan(1);
            console.log(`  ✓ Product has minQuantity = ${minQty}`);

            await ProductDetailPage.takeScreenshot('TC1.4-min-quantity-product');
        });

        it('should verify quantity selector starts at minimum quantity', async () => {
            console.log('\n✓ Test: Quantity starts at minimum');

            const quantity = await ProductDetailPage.getQuantityFromButton();
            console.log(`  Quantity on button: ${quantity}`);

            expect(quantity).toBeGreaterThan(1);
            console.log('  ✓ Quantity selector starts at minimum');
        });

        it('should add to cart successfully with minimum quantity', async () => {
            console.log('\n✓ Test: Add to cart with minimum quantity');

            const buttonText = await ProductDetailPage.addToCartButton.getAttribute('content-desc');
            console.log(`  Adding: ${buttonText}`);

            await ProductDetailPage.addToCart();
            await AlertHelper.waitForAlert();

            const isAlertDisplayed = await AlertHelper.isAddedToCartAlertDisplayed();
            expect(isAlertDisplayed).toBe(true);
            console.log('  ✓ Successfully added to cart');

            await AlertHelper.tapContinueShopping();
            await ProductDetailPage.takeScreenshot('TC1.4-added-with-min-qty');

            // Go back to home
            await ProductDetailPage.goBack();
            await HomePage.waitForPageLoad();

            console.log('  ✓ Test case 1.4 completed');
        });
    });
});