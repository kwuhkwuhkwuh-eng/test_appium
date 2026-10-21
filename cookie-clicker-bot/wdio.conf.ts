import type { Options } from '@wdio/types';

export const config: Options.WebdriverIO = {
  // Подключение к Appium
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  // Тестовые файлы
  specs: ['./tests/**/*.spec.ts'],
  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 300_000, // 5 минут на тест
  },

  // ⚡ Desired Capabilities для реального устройства
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'SM-A525F', // ← ЗАМЕНИТЕ НА ИМЯ ВАШЕГО УСТРОЙСТВА
    'appium:udid': 'XXXXXXXX',       // ← ЗАМЕНИТЕ НА UDID ИЗ adb devices
    'appium:appPackage': 'com.optcookie.CookieClicker',
    'appium:appActivity': 'com.optcookie.CookieClicker.MainActivity',
    'appium:noReset': true,           // не сбрасывать прогресс игры
    'appium:dontStopAppOnReset': true,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 300,
  }],

  reporters: ['spec'],
  logLevel: 'info',
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
};