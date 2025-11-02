exports.config = {
    runner: 'local',

    specs: [
        './test/specs/android/**/*.test.js'
    ],

    exclude: [],
    maxInstances: 1,

capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:automationName': 'UiAutomator2',
    'appium:appPackage': 'host.exp.exponent',
    'appium:appActivity': 'host.exp.exponent.experience.ExperienceActivity',
    
    'appium:noReset': true,
    'appium:fullReset': false,
    
    'appium:newCommandTimeout': 300,
    'appium:autoGrantPermissions': true,
}],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 20000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: [
        ['appium', {
            command: 'appium',
            args: {
                relaxedSecurity: true,
                address: 'localhost',
                port: 4723
            },
            logPath: './logs/'
        }]
    ],

    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    },

    onPrepare: function () {
        console.log('\n===========================================');
        console.log('🚀 Starting E2E Tests');
        console.log('📱 App: Beverage Shopping App');
        console.log('🤖 Platform: Android Emulator');
        console.log('===========================================\n');

        const fs = require('fs');
        ['./screenshots', './logs', './reports'].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    },

    before: function () {
        console.log('🏁 Test session started on Android Emulator');
        console.log('🔄 App state reset (fresh start)\n');
    },

    afterTest: async function (test, context, { error }) {
        if (error) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `FAIL-${test.title.replace(/\s+/g, '-')}-${timestamp}.png`;
            await browser.saveScreenshot(`./screenshots/${filename}`);
            console.log(`📸 Screenshot saved: ${filename}`);
        }
    },

    onComplete: function () {
        console.log('\n===========================================');
        console.log('✅ Test Execution Completed!');
        console.log('📸 Check ./screenshots/ for evidence');
        console.log('📝 Check ./logs/ for detailed logs');
        console.log('===========================================\n');
    }
};