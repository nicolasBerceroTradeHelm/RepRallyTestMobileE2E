const Page = require('./page');

/**
 * Product Detail Page Object
 * Handles interactions with the product detail screen
 */
class ProductDetailPage extends Page {
    /**
     * Selectors for product detail elements
     */
    get pageTitle() {
        return $('android=new UiSelector().text("Product Details")');
    }

    get backButton() {
        return $('android=new UiSelector().descriptionContains("Navigate up")');
    }

    get productImage() {
        return $('android=new UiSelector().className("android.widget.ImageView").instance(0)');
    }

    get brandName() {
        // Search for any TextView containing "Co." or "Brand"
        return $('android=new UiSelector().className("android.widget.TextView").instance(1)');
    }

    get productName() {
        // Product name appears after the brand
        return $('android=new UiSelector().className("android.widget.TextView").instance(2)');
    }

    get wholesaleLabel() {
        return $('android=new UiSelector().text("Wholesale Price")');
    }

    get wholesalePrice() {
        // Find price after "Wholesale Price" label
        return $('android=new UiSelector().textMatches("^\\$\\d+\\.\\d{2}$").instance(0)');
    }

    get retailLabel() {
        return $('android=new UiSelector().text("Suggested Retail")');
    }

    get retailPrice() {
        // Second price on the page
        return $('android=new UiSelector().textMatches("^\\$\\d+\\.\\d{2}$").instance(1)');
    }

    get detailsSection() {
        return $('android=new UiSelector().text("Details")');
    }

    get unitPriceLabel() {
        return $('android=new UiSelector().text("Unit Price")');
    }

    get unitPrice() {
        return $('android=new UiSelector().textContains("/ unit")');
    }

    get caseSizeLabel() {
        return $('android=new UiSelector().text("Case Size")');
    }

    get caseSize() {
        return $('android=new UiSelector().textContains("units")');
    }

    get marginLabel() {
        return $('android=new UiSelector().text("Margin")');
    }

    get margin() {
        return $('android=new UiSelector().textContains("~")');
    }

    get popularityLabel() {
        return $('android=new UiSelector().text("Popularity")');
    }

    get popularity() {
        return $('android=new UiSelector().textContains("Sold in")');
    }

    get addToCartButton() {
        return $('android=new UiSelector().descriptionContains("Add")');
    }

    get cartButton() {
        return $('android=new UiSelector().descriptionContains("🛒")');
    }

    /**
     * Get cart badge (red circle with number)
     */
    async getCartBadge() {
        try {
            const cartGroup = await this.cartButton;
            return await $('android=new UiSelector().className("android.view.ViewGroup").instance(0)');
        } catch (error) {
            return null;
        }
    }

    /**
     * Get quantity from add to cart button text
     * @returns {Promise<number>} Current quantity
     */
    async getQuantityFromButton() {
        const buttonDesc = await this.addToCartButton.getAttribute('content-desc');
        // Extract number from "Add 2 Cases to Cart - $27.98"
        const match = buttonDesc.match(/Add (\d+) Case/);
        return match ? parseInt(match[1]) : 1;
    }

    /**
     * Get product name from the page
     * @returns {Promise<string>} Product name
     */
    async getProductName() {
        try {
            const nameElement = await this.productName;
            return await this.getText(nameElement);
        } catch (error) {
            return '';
        }
    }

    /**
     * Wait for product detail page to load
     */
    async waitForPageLoad() {
        await this.waitForDisplayed(this.pageTitle, 10000);
        await this.pause(1500);
    }

    /**
     * Get all product details
     * @returns {Promise<Object>} Product details object
     */
    async getProductDetails() {
        try {
            return {
                brand: await this.getText(this.brandName),
                name: await this.getText(this.productName),
                wholesalePrice: await this.getText(this.wholesalePrice),
                retailPrice: await this.getText(this.retailPrice),
                unitPrice: await this.getText(this.unitPrice),
                caseSize: await this.getText(this.caseSize),
                margin: await this.getText(this.margin),
                popularity: await this.getText(this.popularity)
            };
        } catch (error) {
            console.log('  ⚠ Error getting product details:', error.message);
            return {};
        }
    }

    /**
     * Verify all product information is displayed
     * @returns {Promise<Object>} Verification results
     */
    async verifyProductDetailsDisplayed() {
        
        return {
            hasBrand: await this.isDisplayed(this.brandName),
            hasName: await this.isDisplayed(this.productName),
            hasWholesalePrice: await this.isDisplayed(this.wholesalePrice),
            hasRetailPrice: await this.isDisplayed(this.retailPrice),
            hasUnitPrice: await this.isDisplayed(this.unitPrice),
            hasCaseSize: await this.isDisplayed(this.caseSize),
            hasMargin: await this.isDisplayed(this.margin),
            hasPopularity: await this.isDisplayed(this.popularity)
        };
    }

    /**
     * Add product to cart
     */
    async addToCart() {
        // Scroll down to ensure button is visible
        await this.swipe('up', 0.3);
        await driver.pause(500);
        
        await this.tap(this.addToCartButton);
        await this.pause(1500);
    }

    /**
     * Go back to product list
     */
    async goBack() {
        await this.tap(this.backButton);
        await this.waitForLoadingComplete();
    }

    /**
     * Navigate to cart
     */
    async goToCart() {
        await this.tap(this.cartButton);
        await this.waitForLoadingComplete();
    }
}

module.exports = new ProductDetailPage();