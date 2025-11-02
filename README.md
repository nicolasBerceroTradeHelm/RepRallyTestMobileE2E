# Beverage Shopping App - E2E Test Suite

[![WebDriverIO](https://img.shields.io/badge/WebDriverIO-EA5906?style=for-the-badge&logo=webdriverio&logoColor=white)](https://webdriver.io/)
[![Appium](https://img.shields.io/badge/Appium-25A162?style=for-the-badge&logo=appium&logoColor=white)](https://appium.io/)
[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

A comprehensive end-to-end testing suite for the Beverage Shopping mobile application, built with **WebDriverIO** and **Appium** for Android testing automation.

## Table of Contents

- [Project Description](#project-description)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Test Suites](#test-suites)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Project Description

This test suite provides comprehensive automated testing for an e-commerce mobile application focusing on front-end and end-to-end flow of the user experience.

### What it Tests:
- **Product Catalog Navigation** - Browse products, view details, check pricing
- **Shopping Cart Management** - Add/remove items, quantity validation, price calculations
- **Checkout Process** - Form validation, order summary, payment flow simulation
- **User Interface Validation** - Element visibility, responsiveness, error handling

## Architecture

The test suite follows industry best practices with a **Page Object Model (POM)** architecture:

```
Test Architecture
├── Page Objects      # Reusable page components
├── Test Specs        # Test scenarios and assertions  
├── Helpers          # Utility functions and data
├── Configuration    # WebDriverIO and Appium setup
└── Reports          # Test results and artifacts
```

## Features

- Cross-platform Support - Android (iOS ready)
- Page Object Model - Maintainable and scalable test code
- Automatic Screenshots - Visual evidence for test results
- Detailed Logging - Comprehensive test execution logs
- Parallel Execution - Fast test runs
- CI/CD Ready - Easily integrates with build pipelines
- Real Device Testing - Works with emulators and physical devices

## Prerequisites

### Software Requirements
- **Node.js** v20+ ([Download](https://nodejs.org/))
- **Android Studio** with Android SDK ([Download](https://developer.android.com/studio))
- **Java JDK** 8+ (for Appium)

### Mobile Setup
- **Android Emulator** running API level 16+
- **Expo App** installed on emulator/device
- **Beverage Shopping App** running via Expo ([Download](https://github.com/RepRally/shop-interview/tree/master))

### Quick Environment Check
```bash
# Verify installations
node --version          # Should be v20+
java -version          # Should be 1.8+
adb devices           # Should show connected device/emulator
```

## Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd MobileTestingWebdriverIO/e2e-tests
npm install
```

### 2. Start Mobile Environment
```bash
# Start Android Emulator (via Android Studio)
# OR connect physical Android device

# Start Expo app with shopping app
expo start
# Press 'a' to open on Android
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Or run specific test suite
npm run test:product-browsing
npm run test:cart-management
npm run test:checkout 
```

## Test Suites

### 1. Product Browsing & Cart Addition
**File**: `01-product-browsing.test.js`
- **TC 1.1**: View Product Catalog
- **TC 1.2**: Add Single Product to Cart  
- **TC 1.3**: Add Multiple Products to Cart
- **TC 1.4**: Minimum Quantity Validation

### 2. Cart Management
**File**: `02-cart-management.test.js`
- **TC 2.1**: View Cart Contents
- **TC 2.5**: Clear All Cart Items
- **TC 2.6**: Cart Price Calculations

### 3. Checkout Flow
**File**: `03-checkout-flow.test.js`
- **TC 3.1**: Navigate to Checkout
- **TC 3.2**: Form Validation (Empty Fields)
- **TC 3.3**: Complete Checkout with Valid Data

## Project Structure

```
e2e-tests/
│
├── package.json              # Dependencies and scripts
├── wdio.android.conf.js      # WebDriverIO configuration
├── README.md                 # This documentation
│
├── test/                     # Test code directory
│   ├── specs/android/        # Test specifications
│   │   ├── 01-product-browsing.test.js
│   │   ├── 02-cart-management.test.js
│   │   └── 03-checkout-flow.test.js
│   │
│   ├── pageobjects/          # Page Object Model
│   │   ├── page.js              # Base page class
│   │   ├── home.page.js         # Product catalog page
│   │   ├── product-detail.page.js # Product details page
│   │   ├── cart.page.js         # Shopping cart page
│   │   └── checkout.page.js     # Checkout form page
│   │
│   └── helpers/              # Utility functions
│       ├── image.helper.js      # Screenshot utilities
│       ├── alert.helper.js      # Alert handling
│       └── test-data.js         # Test data management
│
├── screenshots/              # Test evidence
├── logs/                     # Execution logs  
└── reports/                  # Test reports
```

## Running Tests

### All Test Commands
```bash
# Run complete test suite
npm test
npm run test:all

# Individual test suites
npm run test:product-browsing    # Product catalog tests
npm run test:cart-management     # Shopping cart tests  
npm run test:checkout           # Checkout process tests

# Run specific test file
npm test -- --spec ./test/specs/android/01-product-browsing.test.js
```

### Debug Mode
```bash
# Run with detailed logs
DEBUG=* npm test

# Run single test for debugging
npm test -- --spec ./test/specs/android/01-product-browsing.test.js --grep "View Product Catalog"
```

## Test Reports

### Artifacts Generated
- **Screenshots**: `./screenshots/` - Visual evidence of test execution
- **Logs**: `./logs/wdio-appium.log` - Detailed execution logs
- **Reports**: `./reports/` - Test result reports (if configured)

### Screenshot Naming Convention
```
TC{TestCase}-{Description}-{Timestamp}.png

Examples:
TC1.1-product-catalog-2025-11-02T02-12-56-500Z.png
TC3.2-form-validation-2025-11-02T02-17-30-799Z.png
```

## Configuration

### WebDriverIO Configuration (`wdio.android.conf.js`)

```javascript
// Key configurations
capabilities: [{
    platformName: 'Android',
    'appium:platformVersion': '16',        // Match your emulator
    'appium:deviceName': 'Android Emulator',
    'appium:appPackage': 'host.exp.exponent',
    'appium:appActivity': 'host.exp.exponent.experience.ExperienceActivity'
}]
```

### Environment Variables
```bash
# Optional environment customization
export APPIUM_HOST=localhost
export APPIUM_PORT=4723
export DEVICE_NAME="Pixel_6_API_33"
```

### Customizing for Different Devices
```javascript
// Update wdio.android.conf.js for your specific device
'appium:platformVersion': 'YOUR_ANDROID_VERSION',
'appium:deviceName': 'YOUR_DEVICE_NAME',
```