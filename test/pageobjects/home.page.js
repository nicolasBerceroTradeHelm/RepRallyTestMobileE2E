const Page = require('./page');

/**
 * Home Page Object
 * Handles interactions with the product catalog/home screen
 */
class HomePage extends Page {
    /**
     * Selectors for home page elements
     */
    get pageTitle() {
        return $('android=new UiSelector().text("Shop")');
    }

    get cartButton() {
        return $('android=new UiSelector().descriptionContains("🛒")');
    }

    get scrollView() {
        return $('android=new UiSelector().className("android.widget.ScrollView")');
    }

    /**
     * Get product card by product name
     * @param {string} productName - Name of the product
     */
    async getProductByName(productName) {
        return await $(`android=new UiSelector().text("${productName}")`);
    }

    /**
     * Get product card by its content-desc (which contains all product info)
     * @param {string} productName - Name of the product
     */
    async getProductCardByDesc(productName) {
        return await $(`android=new UiSelector().descriptionContains("${productName}")`);
    }

    /**
     * Get all visible product names
     * @returns {Promise<string[]>} Array of product names
     */
    async getAllProductNames() {
        const allTextViews = await $$('android=new UiSelector().className("android.widget.TextView")');
        const productNames = [];
        
        const knownProducts = [
            'Premium Energy Drink - 12oz',
            'Classic Cola - 16oz',
            'Organic Juice - Variety Pack',
            'Premium Water - 24oz',
            'Sports Hydration - Mixed Flavors',
            'Vitamin Enhanced Water',
            'Cold Brew Coffee',
            'Green Tea - Unsweetened',
            'Sparkling Water - Lime',
            'Protein Shake - Chocolate',
            'Coconut Water - Pure',
            'Iced Tea - Lemon'
        ];
        
        for (const element of allTextViews) {
            try {
                const text = await element.getText();
                if (knownProducts.some(product => text.includes(product.split(' - ')[0]))) {
                    productNames.push(text);
                }
            } catch (error) {
                // Continue
            }
        }
        
        return [...new Set(productNames)];
    }

    /**
     * Get total number of products displayed
     * @returns {Promise<number>} Number of products
     */
    async getProductCount() {
        const productCards = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
        let count = 0;
        
        for (const card of productCards) {
            try {
                const desc = await card.getAttribute('content-desc');
                if (desc && desc.includes('$')) {
                    count++;
                }
            } catch (error) {
                // Continue
            }
        }
        
        return count;
    }

    /**
     * Tap on a product by its name
     * @param {string} productName - Name of the product to tap (can be partial)
     */
    async tapProductByName(productName) {
        console.log(`  Looking for product: "${productName}"`);
        
        const productCard = await $(`android=new UiSelector().descriptionContains("${productName}")`);
        
        await this.waitForDisplayed(productCard, 10000);
        await this.tap(productCard);
        
        console.log('  ✓ Tapped on product');
        await this.waitForLoadingComplete();
    }

    /**
     * Verify a product card displays all required information
     * @param {string} productName - Name of the product to verify
     * @returns {Promise<Object>} Object with verification results
     */
    async verifyProductCard(productName) {
        const productCard = await this.getProductCardByDesc(productName);
        await this.scrollToElement(productCard);
        
        const contentDesc = await productCard.getAttribute('content-desc');
        
        const hasImage = await this.verifyProductHasImage(productCard);
        const hasName = contentDesc.includes(productName);
        const hasPrice = contentDesc.includes('$');
        const hasBrand = contentDesc.split(',').length >= 7;
        
        return {
            hasImage,
            hasName,
            hasPrice,
            hasBrand
        };
    }

    /**
     * Verify product has an image
     * @param {Element} productCard - Product card element
     * @returns {Promise<boolean>} True if image exists
     */
    async verifyProductHasImage(productCard) {
        try {
            const imageView = await productCard.$('android=new UiSelector().className("android.widget.ImageView")');
            return await this.isExisting(imageView);
        } catch (error) {
            return false;
        }
    }

    /**
     * Navigate to cart
     */
    async goToCart() {
        await this.tap(this.cartButton);
        await this.waitForLoadingComplete();
    }

    /**
     * Get cart badge count (si existe)
     * @returns {Promise<string>} Badge count as string
     */
    async getCartBadgeCount() {
        try {
            const badge = await $('android=new UiSelector().className("android.widget.TextView").textMatches("^\\d+$")');
            if (await this.isDisplayed(badge)) {
                return await this.getText(badge);
            }
            return '0';
        } catch (error) {
            return '0';
        }
    }

    /**
     * Scroll down to see more products
     */
    async scrollDown() {
        await this.swipe('up', 0.6);
        await this.pause(1000);
    }

    /**
     * Scroll to specific product
     * @param {string} productName - Name of product to scroll to
     */
    async scrollToProduct(productName) {
        let found = false;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (!found && attempts < maxAttempts) {
            try {
                const product = await this.getProductCardByDesc(productName);
                if (await this.isDisplayed(product)) {
                    await this.scrollToElement(product);
                    found = true;
                }
            } catch (error) {
                await this.scrollDown();
                attempts++;
            }
        }
        
        return found;
    }

    /**
     * Wait for home page to load
     */
    async waitForPageLoad() {
        await this.waitForDisplayed(this.pageTitle, 15000);
        await this.pause(2000);
    }

    /**
     * Verify home page header is displayed
     * @returns {Promise<boolean>} True if header is visible
     */
    async isHeaderDisplayed() {
        const titleDisplayed = await this.isDisplayed(this.pageTitle);
        const cartDisplayed = await this.isDisplayed(this.cartButton);
        return titleDisplayed && cartDisplayed;
    }
}

module.exports = new HomePage();