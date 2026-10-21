import CodeBlock from './CodeBlock';
import Section from './Section';

interface ConfigExampleProps {
  language: 'javascript' | 'python' | 'java';
}

export default function ConfigExample({ language }: ConfigExampleProps) {
  const configs = {
    javascript: `// wdio.conf.ts
import type { Options } from '@wdio/types';

export const config: Options.WebdriverIO = {
  // === Подключение к Appium ===
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  // === Фреймворк ===
  framework: 'mocha',
  specs: ['./tests/**/*.spec.ts'],
  
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // === Capabilities ===
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Pixel_6_API_33',
    'appium:app': './apps/app-debug.apk',
    'appium:appPackage': 'com.example.myapp',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 240,
  }],

  // === Отчётность ===
  reporters: [
    'spec',
    ['allure', {
      outputDir: './reports/allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }]
  ],

  // === Хуки ===
  afterTest: async function(test, context, { error }) {
    if (error) {
      await driver.takeScreenshot();
    }
  },

  // === Логирование ===
  logLevel: 'info',
  
  // === Таймауты ===
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
};`,
    python: `# conftest.py
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options


def get_android_options():
    """Конфигурация для Android"""
    options = UiAutomator2Options()
    options.platform_name = 'Android'
    options.automation_name = 'UiAutomator2'
    options.device_name = 'Pixel_6_API_33'
    options.app = './apps/app-debug.apk'
    options.app_package = 'com.example.myapp'
    options.app_activity = '.MainActivity'
    options.no_reset = False
    options.full_reset = False
    options.auto_grant_permissions = True
    options.new_command_timeout = 240
    return options


def get_ios_options():
    """Конфигурация для iOS"""
    from appium.options.ios import XCUITestOptions
    options = XCUITestOptions()
    options.platform_name = 'iOS'
    options.automation_name = 'XCUITest'
    options.device_name = 'iPhone 14'
    options.platform_version = '16.4'
    options.app = './apps/MyApp.app'
    options.bundle_id = 'com.example.myapp'
    options.no_reset = False
    options.auto_accept_alerts = True
    options.new_command_timeout = 240
    return options


@pytest.fixture(scope="session")
def driver_options():
    """Выбор опций в зависимости от переменной окружения"""
    import os
    platform = os.getenv('PLATFORM', 'android')
    if platform == 'ios':
        return get_ios_options()
    return get_android_options()


@pytest.fixture(scope="function")
def driver(driver_options):
    """Создание и закрытие сессии"""
    appium_url = 'http://127.0.0.1:4723'
    driver = webdriver.Remote(appium_url, options=driver_options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


# pytest.ini
# [pytest]
# markers =
#     smoke: дымовые тесты
#     regression: регрессионные тесты
#     auth: тесты авторизации
# addopts = -v --tb=short`,
    java: `// src/test/resources/config.properties
appium.server.url=http://127.0.0.1:4723
appium.platform.name=Android
appium.automation.name=UiAutomator2
appium.device.name=Pixel_6_API_33
appium.app.path=./apps/app-debug.apk
appium.app.package=com.example.myapp
appium.app.activity=.MainActivity
appium.no.reset=false
appium.full.reset=false
appium.auto.grant.permissions=true

// src/test/java/config/DriverManager.java
package config;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.options.XCUITestOptions;
import org.openqa.selenium.WebDriver;
import java.io.FileInputStream;
import java.net.URL;
import java.time.Duration;
import java.util.Properties;

public class DriverManager {
    private static WebDriver driver;
    private static Properties props;

    static {
        props = new Properties();
        try {
            props.load(new FileInputStream(
                "src/test/resources/config.properties"
            ));
        } catch (Exception e) {
            throw new RuntimeException("Не удалось загрузить конфиг", e);
        }
    }

    public static WebDriver getDriver() {
        if (driver == null) {
            String platform = System.getProperty("platform", "android");
            
            if ("ios".equalsIgnoreCase(platform)) {
                driver = createIOSDriver();
            } else {
                driver = createAndroidDriver();
            }
        }
        return driver;
    }

    private static AndroidDriver createAndroidDriver() {
        try {
            UiAutomator2Options options = new UiAutomator2Options()
                .setPlatformName(props.getProperty("appium.platform.name"))
                .setAutomationName(props.getProperty("appium.automation.name"))
                .setDeviceName(props.getProperty("appium.device.name"))
                .setApp(props.getProperty("appium.app.path"))
                .setAppPackage(props.getProperty("appium.app.package"))
                .setAppActivity(props.getProperty("appium.app.activity"))
                .setNoReset(Boolean.parseBoolean(
                    props.getProperty("appium.no.reset")))
                .setAutoGrantPermissions(Boolean.parseBoolean(
                    props.getProperty("appium.auto.grant.permissions")));

            return new AndroidDriver(
                new URL(props.getProperty("appium.server.url")),
                options
            );
        } catch (Exception e) {
            throw new RuntimeException("Ошибка создания Android драйвера", e);
        }
    }

    private static IOSDriver createIOSDriver() {
        try {
            XCUITestOptions options = new XCUITestOptions()
                .setPlatformName("iOS")
                .setAutomationName("XCUITest")
                .setDeviceName("iPhone 14")
                .setPlatformVersion("16.4")
                .setApp("./apps/MyApp.app")
                .setBundleId("com.example.myapp")
                .setAutoAcceptAlerts(true);

            return new IOSDriver(
                new URL(props.getProperty("appium.server.url")),
                options
            );
        } catch (Exception e) {
            throw new RuntimeException("Ошибка создания iOS драйвера", e);
        }
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}`
  };

  return (
    <Section title="Конфигурация" icon="🔧">
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Конфигурация определяет подключение к Appium серверу, desired capabilities 
          и настройки тестового фреймворка.
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3">📋 Desired Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CapabilityItem name="platformName" value="Android / iOS" />
            <CapabilityItem name="automationName" value="UiAutomator2 / XCUITest" />
            <CapabilityItem name="deviceName" value="Имя устройства/эмулятора" />
            <CapabilityItem name="app" value="Путь к APK/IPA файлу" />
            <CapabilityItem name="appPackage" value="Package name (Android)" />
            <CapabilityItem name="appActivity" value="Activity для запуска (Android)" />
            <CapabilityItem name="noReset" value="Не сбрасывать состояние приложения" />
            <CapabilityItem name="autoGrantPermissions" value="Авто-разрешение запросов" />
          </div>
        </div>

        <CodeBlock language={language} code={configs[language]} />

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-5">
          <h4 className="font-semibold text-blue-300 mb-2">💡 Получение capabilities</h4>
          <div className="text-gray-300 text-sm space-y-2">
            <p>Для Android:</p>
            <CodeBlock
              language="bash"
              code={`# Package name и Activity
adb shell dumpsys activity | grep "mResumedActivity"

# Или из APK
aapt dump badging app.apk | grep package
aapt dump badging app.apk | grep launchable-activity`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function CapabilityItem({ name, value }: { name: string; value: string }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-3">
      <code className="text-purple-400 text-xs">{name}</code>
      <p className="text-gray-400 text-xs mt-1">{value}</p>
    </div>
  );
}