# Shopping App - E2E Test Automation Suite

[![WebDriverIO](https://img.shields.io/badge/WebDriverIO-v9.4-orange.svg)](https://webdriver.io/)
[![Appium](https://img.shields.io/badge/Appium-v2.12-blue.svg)](https://appium.io/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Comprehensive end-to-end test automation suite for the Shopping App mobile application. Built with WebDriverIO, Appium, and the Page Object Model design pattern to ensure reliable and maintainable test coverage.

## Table of Contents

- [Overview](#overview)
- [Test Coverage](#test-coverage)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Test Suites](#test-suites)
- [Page Object Model](#page-object-model)
- [Test Reports](#test-reports)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## Overview

This test automation suite provides comprehensive E2E testing for the Shopping App, a React Native mobile application built with Expo. The suite validates the complete user journey from product browsing through checkout completion.

### What We Test

- **Product Catalog** - Display, layout, and product information accuracy
- **Product Details** - Pricing, specifications, and add-to-cart functionality
- **Shopping Cart** - Item management, quantity updates, and price calculations
- **Checkout Flow** - Form validation, order placement, and confirmation

### Purpose

The Shopping App is designed as an assessment application to demonstrate QA automation skills. This test suite validates all critical user flows and business logic without requiring backend integration.

## Test Coverage

### Complete User Journey

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│   Product   │ --> │   Product    │ --> │ Shopping │ --> │ Checkout │
│   Catalog   │     │   Details    │     │   Cart   │     │   Flow   │
└─────────────┘     └──────────────┘     └──────────┘     └──────────┘
      |                     |                   |                |
  • View Grid         • View Info        • View Items    • Enter Info
  • Verify Cards      • Add to Cart      • Update Qty    • Validate Form
  • Tap Product       • Verify Alert     • Remove Item   • Place Order
  • Multiple Items    • Min Quantity     • Clear Cart    • Confirmation
                                         • Calculate Tax
```

### Test Statistics

| Metric | Count |
|--------|-------|
| Test Suites | 3 |
| Test Cases | 13 |
| Assertions | 45+ |
| Page Objects | 5 |
| Helper Classes | 3 |
| Estimated Runtime | 5-8 minutes |

## Tech Stack

### Core Framework
- **[WebDriverIO](https://webdriver.io/)** v9.4.1 - Test automation framework
- **[Appium](https://appium.io/)** v2.12.1 - Mobile automation server
- **[Appium UiAutomator2](https://github.com/appium/appium-uiautomator2-driver)** - Android driver
- **[Mocha](https://mochajs.org/)** - BDD test framework

### Design Patterns
- **Page Object Model (POM)** - Maintainable, reusable page interactions
- **Async/Await** - Modern asynchronous JavaScript patterns
- **DRY Principles** - Shared utilities and base classes

### Reporting & Utilities
- **Spec Reporter** - Detailed console output with test results
- **Screenshot Capture** - Automatic evidence collection
- **Detailed Logging** - Step-by-step test execution logs

## Prerequisites

### Required Software

1. **Node.js** v18 or higher
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **Java JDK** 11 or higher
   ```bash
   java -version  # Should be 11 or higher
   ```

3. **Android Studio** with Android SDK
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK Platform-Tools
   - Set up `ANDROID_HOME` environment variable

4. **Appium** v2.x
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   ```

5. **Shopping App Repository**
   ```bash
   git clone https://github.com/RepRally/shop-interview.git
   cd shop-interview
   npm install
   ```

### Environment Setup

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk        # Linux
# export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk  # Windows

export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

### Device Requirements

**Option 1: Android Emulator** (Recommended for CI/CD)
- Android 11 (API 30) or higher
- Minimum 4GB RAM allocated
- Hardware acceleration enabled

**Option 2: Physical Android Device**
- USB Debugging enabled
- Developer options enabled
- Connected via USB or Wi-Fi

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nicolasBerceroTradeHelm/RepRallyTestMobileE2E.git
cd RepRallyTestMobileE2E
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- WebDriverIO and all required plugins
- Appium service
- Mocha framework
- TypeScript support (optional)

### 3. Verify Appium Setup

```bash
# Check Appium installation
appium --version

# Verify UiAutomator2 driver
appium driver list

# Check connected devices
adb devices
```

Expected output:
```
List of devices attached
emulator-5554    device
```

## Configuration

### Update Device Configuration

Edit `wdio.android.conf.js`:

```javascript
capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',  // Your device ID
    'appium:automationName': 'UiAutomator2',
    'appium:appPackage': 'host.exp.exponent',  // Expo Go package
    'appium:appActivity': 'host.exp.exponent.experience.ExperienceActivity',
    'appium:noReset': true,
    'appium:fullReset': false,
}]
```

### Key Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `deviceName` | Your emulator/device ID | `emulator-5554` |
| `appPackage` | App package identifier | `host.exp.exponent` |
| `appActivity` | Launch activity | `host.exp.exponent.experience.ExperienceActivity` |
| `noReset` | Keep app state between tests | `true` |
| `waitforTimeout` | Element wait timeout | `20000` ms |

### Finding Your Device ID

```bash
# List all connected devices
adb devices

# Example output:
# emulator-5554    device
# RFCT12345XYZ     device
```

Use the device ID in your configuration.

## Running Tests

### Prerequisites Before Running


1. **Start the Shopping App**:
   ```bash
   cd shopping-app
   npm start
   # Then press 'a' for Android or scan QR with Expo Go
   ```

2. **Start Appium Server** (in a separate terminal):
   ```bash
   appium
   ```

3. **Verify app is running** on your device/emulator

### Run All Tests

```bash
npm test
```

### Run Individual Test Suites

```bash
# Product Browsing Tests (TC 1.1 - 1.4)
npm run test:product-browsing

# Cart Management Tests (TC 2.1, 2.5, 2.6)
npm run test:cart-management

# Checkout Flow Tests (TC 3.1 - 3.3)
npm run test:checkout
```

### Run Specific Test File

```bash
npx wdio run wdio.android.conf.js --spec ./test/specs/android/01-product-browsing_test.js
```

### Advanced Options

```bash
# Run with specific device
npm test -- --deviceName emulator-5556

# Run with verbose logging
npm test -- --logLevel debug

# Run specific test case
npx wdio run wdio.android.conf.js --spec ./test/specs/android/01-product-browsing_test.js --mochaOpts.grep "should add product to cart"
```

## Project Structure

```
e2e-tests/
│
├── test/
│   ├── specs/
│   │   └── android/
│   │       ├── 01-product-browsing_test.js    # Product catalog & cart tests
│   │       ├── 02-cart-management_test.js     # Cart operations tests
│   │       └── 03-checkout-flow_test.js       # Checkout process tests
│   │
│   └── pageobjects/
│       ├── page.js                             # Base page with common methods
│       ├── home_page.js                        # Product catalog page
│       ├── product-detail_page.js              # Product detail page
│       ├── cart_page.js                        # Shopping cart page
│       └── checkout_page.js                    # Checkout page
│
├── helpers/
│   ├── alert_helper.js                         # Alert/dialog handlers
│   ├── image_helper.js                         # Image validation utilities
│   └── test-data.js                            # Test data constants
│
├── screenshots/                                 # Auto-generated screenshots
├── logs/                                        # Appium and test logs
├── reports/                                     # Test execution reports
│
├── wdio.android.conf.js                        # WebDriverIO configuration
├── package.json                                # Dependencies and scripts
└── README.md                                   # This file
```

### Key Directories

| Directory | Purpose | Auto-Generated |
|-----------|---------|----------------|
| `test/specs/` | Test specifications | No |
| `test/pageobjects/` | Page object classes | No |
| `helpers/` | Utility functions | No |
| `screenshots/` | Test evidence | Yes |
| `logs/` | Execution logs | Yes |
| `reports/` | Test reports | Yes |

## Test Suites

### Suite 1: Product Browsing & Cart Addition

**File:** `01-product-browsing_test.js`

#### Test Case 1.1: View Product Catalog
- Verify home page displays product grid
- Verify product cards show image, name, price, brand
- Verify multiple products are displayed

#### Test Case 1.2: Add Single Product to Cart
- Navigate to product detail page
- Verify product details are displayed
- Verify minimum quantity is enforced
- Add product to cart
- Verify success alert appears
- Verify cart badge updates

#### Test Case 1.3: Add Multiple Products to Cart
- Add 3 different products to cart
- Verify cart badge shows total quantity
- Navigate to cart and verify all products present

#### Test Case 1.4: Minimum Quantity Validation
- Select product with minQuantity > 1
- Verify quantity selector starts at minimum
- Add to cart successfully with minimum quantity

### Suite 2: Cart Management

**File:** `02-cart-management_test.js`

#### Test Case 2.1: View Cart Contents
- Navigate to cart and display items
- Verify cart items show correct information
- Display subtotal, tax (8%), and total

#### Test Case 2.5: Clear All Cart Items
- Click "Clear all" button
- Confirm clear action
- Verify cart is empty
- Verify empty state message is displayed

#### Test Case 2.6: Cart Price Calculations
- Add products with known prices
- Verify subtotal, tax, and total calculations

### Suite 3: Checkout Flow

**File:** `03-checkout-flow_test.js`

#### Test Case 3.1: Navigate to Checkout
- Navigate from cart to checkout page
- Verify checkout form fields are displayed
- Verify order summary is displayed

#### Test Case 3.2: Form Validation (Empty Fields)
- Attempt to place order with empty fields
- Verify validation for Store Name
- Verify validation for Contact Name
- Verify validation for Email
- Verify validation for Phone Number

#### Test Case 3.3: Complete Checkout with Valid Data
- Fill all form fields with valid data
- Place order successfully
- Verify order success confirmation with order ID
- Verify navigation back to home page

## Page Object Model

### Architecture

```
Page (Base Class)
├── Common Methods
│   ├── tap()
│   ├── enterText()
│   ├── swipe()
│   ├── waitForDisplayed()
│   └── takeScreenshot()
│
├── HomePage
│   ├── tapProductByName()
│   ├── getAllProductNames()
│   └── goToCart()
│
├── ProductDetailPage
│   ├── addToCart()
│   ├── getProductDetails()
│   └── verifyProductDetailsDisplayed()
│
├── CartPage
│   ├── clearCart()
│   ├── isCartEmpty()
│   └── proceedToCheckout()
│
└── CheckoutPage
    ├── fillStoreName()
    ├── fillContactName()
    ├── fillEmail()
    ├── fillPhone()
    └── tapPlaceOrder()
```

## Test Reports

### Console Output

Tests produce detailed console output with:
- Pass/fail status for each test
- Screenshot references
- Execution time
- Step-by-step logs

**Example Output:**
```
===========================================
Starting E2E Tests
App: Shopping App
Platform: Android Emulator
===========================================

Starting Product Browsing & Cart Addition Tests...
Preparing clean state...
Ready to start tests

Test: Home page displays product grid
  Header with title "Shop" and cart button displayed
  Product grid is displayed with 6 visible products
  Screenshot saved: TC1.1-product-grid

Test: Navigate to product detail
  Looking for product: "Premium Energy Drink"
  Tapped on product
  Product detail page loaded
  Screenshot saved: TC1.2-product-detail-page
```

### Screenshots

**Location:** `./screenshots/`

**Naming Convention:**
```
TC[Test-Case]-[Description]-[Timestamp].png

Examples:
TC1.1-product-grid-2025-11-02T01-23-45.png
TC1.2-add-to-cart-tapped-2025-11-02T01-24-10.png
TC3.3-order-success-2025-11-02T01-28-33.png
```

### Logs

**Location:** `./logs/`

Contains:
- Appium server logs
- WebDriverIO execution logs
- Error stack traces
- Network requests (if enabled)