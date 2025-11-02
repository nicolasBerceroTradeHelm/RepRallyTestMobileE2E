# Beverage Shopping App - E2E Tests

E2E automated tests for the Beverage Shopping App using WebDriverIO + Appium on Android.

## Prerequisites

- Node.js v20+
- Android Studio with Android SDK
- Android Emulator running
- Expo app running on emulator

## Installation
```bash
npm install
```

## Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:product-browsing
npm run test:cart
npm run test:checkout

# Run interactive tests (with pauses)
npm run test:interactive
```

## Setup

1. Start Android Emulator
2. Start Expo app: `yarn start` then press `a`
3. Wait for app to load
4. Run tests

## Test Results

- Screenshots: `./screenshots/`
- Logs: `./logs/`
- Reports: `./reports/`

## Test Structure
```
test/
├── specs/android/          # Test specifications
├── pageobjects/            # Page Object Model
└── helpers/                # Helper utilities
```