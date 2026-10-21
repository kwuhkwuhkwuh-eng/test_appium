import { useState } from 'react';
import Sidebar from './components/Sidebar';
import CodeBlock from './components/CodeBlock';
import Section from './components/Section';
import ProjectStructure from './components/ProjectStructure';
import ConfigExample from './components/ConfigExample';

const sections = [
  { id: 'intro', title: 'Введение', icon: '📱' },
  { id: 'setup', title: 'Установка', icon: '⚙️' },
  { id: 'structure', title: 'Структура проекта', icon: '📁' },
  { id: 'config', title: 'Конфигурация', icon: '🔧' },
  { id: 'first-test', title: 'Первый тест', icon: '🧪' },
  { id: 'locators', title: 'Локаторы', icon: '🎯' },
  { id: 'actions', title: 'Действия', icon: '👆' },
  { id: 'advanced', title: 'Продвинутые техники', icon: '🚀' },
  { id: 'best-practices', title: 'Best Practices', icon: '✅' },
];

function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                📱
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Appium Автотесты
                </h1>
                <p className="text-gray-400 text-sm">Интерактивный гайд по мобильному тестированию</p>
              </div>
            </div>
            
            {/* Language selector */}
            <div className="flex gap-2 mt-4">
              {(['javascript', 'python', 'java'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  {lang === 'javascript' ? '🟨 JavaScript' : lang === 'python' ? '🐍 Python' : '☕ Java'}
                </button>
              ))}
            </div>
          </header>

          {/* Sections */}
          {activeSection === 'intro' && <IntroSection />}
          {activeSection === 'setup' && <SetupSection />}
          {activeSection === 'structure' && <ProjectStructure />}
          {activeSection === 'config' && <ConfigExample language={language} />}
          {activeSection === 'first-test' && <FirstTestSection language={language} />}
          {activeSection === 'locators' && <LocatorsSection language={language} />}
          {activeSection === 'actions' && <ActionsSection language={language} />}
          {activeSection === 'advanced' && <AdvancedSection language={language} />}
          {activeSection === 'best-practices' && <BestPracticesSection />}
        </div>
      </main>
    </div>
  );
}

function IntroSection() {
  return (
    <Section title="Введение в Appium" icon="📱">
      <div className="space-y-6">
        <p className="text-gray-300 text-lg leading-relaxed">
          <strong className="text-purple-400">Appium</strong> — это open-source инструмент для автоматизации 
          тестирования мобильных приложений на iOS, Android и Windows. Он позволяет писать тесты используя 
          те же API, что и для веб-тестирования (WebDriver protocol).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-white mb-2">Кроссплатформенность</h3>
            <p className="text-gray-400 text-sm">Один API для iOS, Android и Windows приложений</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <div className="text-3xl mb-3">🔓</div>
            <h3 className="font-semibold text-white mb-2">Open Source</h3>
            <p className="text-gray-400 text-sm">Бесплатный инструмент с активным сообществом</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <div className="text-3xl mb-3">🗣️</div>
            <h3 className="font-semibold text-white mb-2">Мультиязычность</h3>
            <p className="text-gray-400 text-sm">Java, Python, JavaScript, Ruby, C# и другие</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-purple-300 mb-3">🏗️ Архитектура Appium</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>Appium работает по клиент-серверной архитектуре:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong className="text-gray-200">Appium Server</strong> — HTTP сервер, принимающий команды от клиента</li>
              <li><strong className="text-gray-200">Driver</strong> — адаптер для конкретной платформы (UiAutomator2, XCUITest)</li>
              <li><strong className="text-gray-200">Client Library</strong> — библиотека на языке тестировщика</li>
              <li><strong className="text-gray-200">Device/Emulator</strong> — целевое устройство для тестирования</li>
            </ul>
          </div>
        </div>

        <CodeBlock
          language="bash"
          code={`# Проверка установки Appium
appium --version

# Запуск Appium сервера
appium

# Запуск на конкретном порту
appium -p 4723

# С логированием
appium --log-level debug`}
        />
      </div>
    </Section>
  );
}

function SetupSection() {
  return (
    <Section title="Установка и настройка" icon="⚙️">
      <div className="space-y-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">📋 Требования</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-200">Node.js</strong>
                <p className="text-gray-400 text-sm">v16 или выше</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-200">Java JDK</strong>
                <p className="text-gray-400 text-sm">v11 или выше (для Android)</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-200">Android SDK</strong>
                <p className="text-gray-400 text-sm">Android Studio с настроенным SDK</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-200">Xcode</strong>
                <p className="text-gray-400 text-sm">Для iOS (только macOS)</p>
              </div>
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-white">🚀 Установка</h3>

        <CodeBlock
          language="bash"
          code={`# 1. Установка Appium через npm
npm install -g appium

# 2. Установка драйвера для Android
appium driver install uiautomator2

# 3. Установка драйвера для iOS
appium driver install xcuitest

# 4. Проверка установки
appium driver list --installed`}
        />

        <h3 className="text-xl font-semibold text-white">📦 Установка клиентских библиотек</h3>

        <CodeBlock
          language="bash"
          code={`# JavaScript/TypeScript (WebdriverIO)
npm install --save-dev @wdio/cli @wdio/local-runner
npm install --save-dev appium
npx wdio config

# Python
pip install Appium-Python-Client

# Java (Maven)
# Добавить в pom.xml:
# <dependency>
#   <groupId>io.appium</groupId>
#   <artifactId>java-client</artifactId>
#   <version>9.0.0</version>
# </dependency>`}
        />

        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-5">
          <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Переменные окружения</h4>
          <CodeBlock
            language="bash"
            code={`# Android
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Java
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export PATH=$PATH:$JAVA_HOME/bin`}
          />
        </div>
      </div>
    </Section>
  );
}

function FirstTestSection({ language }: { language: 'javascript' | 'python' | 'java' }) {
  const codeExamples = {
    javascript: `// tests/login.spec.js
const { remote } = require('webdriverio');

describe('Login Test', () => {
  let driver;

  before(async () => {
    driver = await remote({
      hostname: '127.0.0.1',
      port: 4723,
      capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Pixel_6',
        'appium:app': '/path/to/app.apk',
        'appium:appPackage': 'com.example.myapp',
        'appium:appActivity': '.MainActivity',
        'appium:noReset': true,
      }
    });
  });

  after(async () => {
    await driver.deleteSession();
  });

  it('should login with valid credentials', async () => {
    // Ждём появления поля логина
    const usernameField = await driver.$('~username-input');
    await usernameField.waitForDisplayed({ timeout: 10000 });
    
    // Вводим данные
    await usernameField.setValue('testuser@example.com');
    
    const passwordField = await driver.$('~password-input');
    await passwordField.setValue('SecurePass123!');
    
    // Нажимаем кнопку входа
    const loginButton = await driver.$('~login-button');
    await loginButton.click();
    
    // Проверяем успешный вход
    const welcomeText = await driver.$('~welcome-message');
    await expect(welcomeText).toBeDisplayed();
    await expect(welcomeText).toHaveText('Welcome, Test User!');
  });

  it('should show error for invalid credentials', async () => {
    const usernameField = await driver.$('~username-input');
    await usernameField.setValue('wrong@email.com');
    
    const passwordField = await driver.$('~password-input');
    await passwordField.setValue('wrongpass');
    
    const loginButton = await driver.$('~login-button');
    await loginButton.click();
    
    const errorText = await driver.$('~error-message');
    await expect(errorText).toBeDisplayed();
    await expect(errorText).toHaveText('Invalid credentials');
  });
});`,
    python: `# tests/test_login.py
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@pytest.fixture(scope="function")
def driver():
    options = UiAutomator2Options()
    options.platform_name = 'Android'
    options.device_name = 'Pixel_6'
    options.app = '/path/to/app.apk'
    options.app_package = 'com.example.myapp'
    options.app_activity = '.MainActivity'
    options.no_reset = True

    driver = webdriver.Remote(
        'http://127.0.0.1:4723',
        options=options
    )
    yield driver
    driver.quit()


class TestLogin:
    def test_login_with_valid_credentials(self, driver):
        wait = WebDriverWait(driver, 10)
        
        # Ждём и вводим логин
        username = wait.until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, 'username-input')
            )
        )
        username.send_keys('testuser@example.com')
        
        # Вводим пароль
        password = driver.find_element(
            AppiumBy.ACCESSIBILITY_ID, 'password-input'
        )
        password.send_keys('SecurePass123!')
        
        # Нажимаем кнопку входа
        login_btn = driver.find_element(
            AppiumBy.ACCESSIBILITY_ID, 'login-button'
        )
        login_btn.click()
        
        # Проверяем успешный вход
        welcome = wait.until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, 'welcome-message')
            )
        )
        assert welcome.is_displayed()
        assert 'Welcome, Test User!' in welcome.text

    def test_login_with_invalid_credentials(self, driver):
        username = driver.find_element(
            AppiumBy.ACCESSIBILITY_ID, 'username-input'
        )
        username.send_keys('wrong@email.com')
        
        password = driver.find_element(
            AppiumBy.ACCESSIBILITY_ID, 'password-input'
        )
        password.send_keys('wrongpass')
        
        login_btn = driver.find_element(
            AppiumBy.ACCESSIBILITY_ID, 'login-button'
        )
        login_btn.click()
        
        error = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, 'error-message')
            )
        )
        assert error.is_displayed()
        assert 'Invalid credentials' in error.text`,
    java: `// src/test/java/tests/LoginTest.java
package tests;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import java.net.URL;

public class LoginTest {
    private static AndroidDriver driver;

    @BeforeAll
    static void setUp() throws Exception {
        UiAutomator2Options options = new UiAutomator2Options()
            .setPlatformName("Android")
            .setDeviceName("Pixel_6")
            .setApp("/path/to/app.apk")
            .setAppPackage("com.example.myapp")
            .setAppActivity(".MainActivity")
            .setNoReset(true);

        driver = new AndroidDriver(
            new URL("http://127.0.0.1:4723"),
            options
        );
    }

    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Вход с валидными данными")
    void testLoginWithValidCredentials() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Ждём и заполняем поле логина
        var username = wait.until(
            ExpectedConditions.presenceOfElementLocated(
                By.id("com.example.myapp:id/username_input")
            )
        );
        username.sendKeys("testuser@example.com");
        
        // Заполняем пароль
        var password = driver.findElement(
            By.id("com.example.myapp:id/password_input")
        );
        password.sendKeys("SecurePass123!");
        
        // Нажимаем кнопку входа
        var loginBtn = driver.findElement(
            By.id("com.example.myapp:id/login_button")
        );
        loginBtn.click();
        
        // Проверяем успешный вход
        var welcome = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("com.example.myapp:id/welcome_message")
            )
        );
        Assertions.assertTrue(welcome.isDisplayed());
        Assertions.assertTrue(
            welcome.getText().contains("Welcome, Test User!")
        );
    }

    @Test
    @DisplayName("Ошибка при неверных данных")
    void testLoginWithInvalidCredentials() {
        var username = driver.findElement(
            By.id("com.example.myapp:id/username_input")
        );
        username.sendKeys("wrong@email.com");
        
        var password = driver.findElement(
            By.id("com.example.myapp:id/password_input")
        );
        password.sendKeys("wrongpass");
        
        var loginBtn = driver.findElement(
            By.id("com.example.myapp:id/login_button")
        );
        loginBtn.click();
        
        var error = new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(
                By.id("com.example.myapp:id/error_message")
            ));
        Assertions.assertTrue(error.isDisplayed());
        Assertions.assertTrue(
            error.getText().contains("Invalid credentials")
        );
    }
}`
  };

  return (
    <Section title="Первый автотест" icon="🧪">
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Рассмотрим полноценный тест авторизации в мобильном приложении. 
          Тест проверяет как успешный вход, так и обработку ошибок.
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3">📝 Что делает тест:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
            <li>Подключается к Appium серверу</li>
            <li>Открывает приложение на устройстве</li>
            <li>Находит элементы по accessibility id</li>
            <li>Вводит учётные данные</li>
            <li>Нажимает кнопку входа</li>
            <li>Проверяет результат (успех/ошибка)</li>
          </ol>
        </div>

        <CodeBlock language={language} code={codeExamples[language]} />

        <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-5">
          <h4 className="font-semibold text-green-300 mb-2">▶️ Запуск теста</h4>
          <CodeBlock
            language="bash"
            code={`# JavaScript (WebdriverIO)
npx wdio run wdio.conf.js

# Python (pytest)
pytest tests/test_login.py -v

# Java (Maven)
mvn test -Dtest=LoginTest`}
          />
        </div>
      </div>
    </Section>
  );
}

function LocatorsSection({ language }: { language: 'javascript' | 'python' | 'java' }) {
  const codeExamples = {
    javascript: `// === Локаторы в Appium ===

// 1. Accessibility ID (рекомендуется!)
const el = await driver.$('~my-accessibility-id');

// 2. ID элемента (Android)
const el = await driver.$('com.example.app:id/my_element');

// 3. XPath
const el = await driver.$('//android.widget.TextView[@text="Login"]');

// 4. Class Name
const el = await driver.$('android.widget.EditText');

// 5. CSS Selector (ограниченно)
const el = await driver.$('android.widget.Button');

// 6. Predicate (iOS)
const el = await driver.$('-ios predicate string:type == "XCUIElementTypeButton" AND name == "Login"');

// 7. Class Chain (iOS)
const el = await driver.$('-ios class chain:**/XCUIElementTypeButton[\`name == "Login"\`]');

// === Предикаты для поиска ===
const el = await driver.$('~login-button');
const isDisplayed = await el.isDisplayed();
const isEnabled = await el.isEnabled();
const text = await el.getText();
const attribute = await el.getAttribute('content-desc');

// === Ожидание элементов ===
await el.waitForDisplayed({ timeout: 10000 });
await el.waitForEnabled({ timeout: 5000 });
await el.waitForExist({ timeout: 5000 });`,
    python: `# === Локаторы в Appium ===
from appium.webdriver.common.appiumby import AppiumBy

# 1. Accessibility ID (рекомендуется!)
el = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'my-accessibility-id')

# 2. ID элемента (Android)
el = driver.find_element(AppiumBy.ID, 'com.example.app:id/my_element')

# 3. XPath
el = driver.find_element(
    AppiumBy.XPATH, 
    '//android.widget.TextView[@text="Login"]'
)

# 4. Class Name
el = driver.find_element(
    AppiumBy.CLASS_NAME, 
    'android.widget.EditText'
)

# 5. Predicate (iOS)
el = driver.find_element(
    AppiumBy.IOS_PREDICATE,
    'type == "XCUIElementTypeButton" AND name == "Login"'
)

# 6. Class Chain (iOS)
el = driver.find_element(
    AppiumBy.IOS_CLASS_CHAIN,
    '**/XCUIElementTypeButton[\`name == "Login"\`]'
)

# === Проверки элементов ===
is_displayed = el.is_displayed()
is_enabled = el.is_enabled()
text = el.text
attribute = el.get_attribute('content-desc')

# === Ожидание элементов ===
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
el = wait.until(EC.presence_of_element_located(
    (AppiumBy.ACCESSIBILITY_ID, 'my-element')
))
el = wait.until(EC.visibility_of_element_located(
    (AppiumBy.ACCESSIBILITY_ID, 'my-element')
))`,
    java: `// === Локаторы в Appium ===
import org.openqa.selenium.By;
import io.appium.java_client.AppiumBy;

// 1. Accessibility ID (рекомендуется!)
WebElement el = driver.findElement(
    AppiumBy.accessibilityId("my-accessibility-id")
);

// 2. ID элемента (Android)
WebElement el = driver.findElement(
    By.id("com.example.app:id/my_element")
);

// 3. XPath
WebElement el = driver.findElement(
    By.xpath("//android.widget.TextView[@text='Login']")
);

// 4. Class Name
WebElement el = driver.findElement(
    By.className("android.widget.EditText")
);

// 5. iOS Class Chain
WebElement el = driver.findElement(
    AppiumBy.iOSClassChain("**/XCUIElementTypeButton[\`name == 'Login'\`]")
);

// 6. iOS NSPredicate
WebElement el = driver.findElement(
    AppiumBy.iOSNsPredicateString(
        "type == 'XCUIElementTypeButton' AND name == 'Login'"
    )
);

// === Проверки элементов ===
boolean isDisplayed = el.isDisplayed();
boolean isEnabled = el.isEnabled();
String text = el.getText();
String attribute = el.getAttribute("content-desc");

// === Ожидание элементов ===
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement el = wait.until(
    ExpectedConditions.presenceOfElementLocated(
        AppiumBy.accessibilityId("my-element")
    )
);`
  };

  return (
    <Section title="Локаторы элементов" icon="🎯">
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Локаторы — это способ найти элемент на экране. Правильный выбор локатора 
          критически важен для стабильности тестов.
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3">📊 Приоритет локаторов</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">1</span>
              <span className="text-gray-300">Accessibility ID — самый стабильный и быстрый</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded font-bold">2</span>
              <span className="text-gray-300">ID ресурса (Android) — хороший вариант</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded font-bold">3</span>
              <span className="text-gray-300">Class Name — если нет других вариантов</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">4</span>
              <span className="text-gray-300">XPath — хрупкий, использовать в крайнем случае</span>
            </div>
          </div>
        </div>

        <CodeBlock language={language} code={codeExamples[language]} />

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-5">
          <h4 className="font-semibold text-blue-300 mb-2">💡 Совет</h4>
          <p className="text-gray-300 text-sm">
            Для инспекции элементов используйте <strong>Appium Inspector</strong> — 
            визуальный инструмент для поиска и проверки локаторов. 
            Установите: <code className="bg-gray-800 px-2 py-0.5 rounded">npm install -g appium-inspector</code>
          </p>
        </div>
      </div>
    </Section>
  );
}

function ActionsSection({ language }: { language: 'javascript' | 'python' | 'java' }) {
  const codeExamples = {
    javascript: `// === Действия с элементами ===

// Клик
await element.click();

// Ввод текста
await element.setValue('Hello World');
await element.addValue(' appended text');

// Очистка поля
await element.clearValue();

// Свайп (W3C Actions)
const actions = driver.addActionSequence();
await actions
  .move({ x: 500, y: 1500 })
  .down()
  .move({ duration: 500, x: 500, y: 500 })
  .up()
  .perform();

// Свайп вверх (скролл)
await driver.execute('mobile: scroll', {
  direction: 'up',
  element: element.elementId
});

// Свайп вниз
await driver.execute('mobile: scroll', {
  direction: 'down'
});

// Жест "потянуть" (pull to refresh)
await driver.execute('mobile: swipe', {
  direction: 'down',
  element: element.elementId
});

// === Работа с клавиатурой ===
await driver.hideKeyboard();
await driver.isKeyboardShown();

// === Работа с уведомлениями ===
await driver.openNotifications();

// === Скриншот ===
const screenshot = await driver.takeScreenshot();
// Сохранить в файл
const fs = require('fs');
fs.writeFileSync('screenshot.png', screenshot, 'base64');

// === Переключение контекста ===
const contexts = await driver.getContexts();
// WebView
await driver.switchToContext('WEBVIEW_com.example.app');
// Native
await driver.switchToContext('NATIVE_APP');`,
    python: `# === Действия с элементами ===
from appium.webdriver.common.touch_action import TouchAction
from selenium.webdriver.common.action_chains import ActionChains

# Клик
element.click()

# Ввод текста
element.send_keys('Hello World')

# Очистка поля
element.clear()

# Свайп (Touch Action)
action = TouchAction(driver)
action.press(x=500, y=1500)
action.wait(200)
action.move_to(x=500, y=500)
action.release()
action.perform()

# Свайп через execute
driver.execute_script('mobile: scroll', {
    'direction': 'up',
    'elementId': element.id
})

# Свайп вниз
driver.execute_script('mobile: scroll', {
    'direction': 'down'
})

# === Работа с клавиатурой ===
driver.hide_keyboard()
is_shown = driver.is_keyboard_shown()

# === Работа с уведомлениями ===
driver.open_notifications()

# === Скриншот ===
driver.save_screenshot('screenshot.png')

# === Переключение контекста ===
contexts = driver.contexts
# WebView
driver.switch_to.context('WEBVIEW_com.example.app')
# Native
driver.switch_to.context('NATIVE_APP')

# === Установка/удаление приложения ===
driver.install_app('/path/to/app.apk')
driver.remove_app('com.example.app')
driver.is_app_installed('com.example.app')

# === Запуск/закрытие приложения ===
driver.activate_app('com.example.app')
driver.terminate_app('com.example.app')`,
    java: `// === Действия с элементами ===
import io.appium.java_client.touch.TouchAction;
import io.appium.java_client.touch.offset.PointOption;
import static io.appium.java_client.touch.LongPressOptions.longPressOptions;
import java.time.Duration;

// Клик
element.click();

// Ввод текста
element.sendKeys("Hello World");

// Очистка поля
element.clear();

// Свайп (TouchAction)
TouchAction action = new TouchAction(driver);
action.press(PointOption.point(500, 1500))
      .waitAction(Duration.ofMillis(200))
      .moveTo(PointOption.point(500, 500))
      .release()
      .perform();

// Свайп через execute
Map<String, Object> params = new HashMap<>();
params.put("direction", "up");
driver.executeScript("mobile: scroll", params);

// === Работа с клавиатурой ===
driver.hideKeyboard();
boolean isShown = driver.isKeyboardShown();

// === Работа с уведомлениями ===
driver.openNotifications();

// === Скриншот ===
File screenshot = driver.getScreenshotAs(OutputType.FILE);
FileUtils.copyFile(screenshot, new File("screenshot.png"));

// === Переключение контекста ===
Set<String> contexts = driver.getContextHandles();
driver.context("WEBVIEW_com.example.app");
driver.context("NATIVE_APP");

// === Установка/удаление приложения ===
driver.installApp(new File("/path/to/app.apk"));
driver.removeApp("com.example.app");
boolean installed = driver.isAppInstalled("com.example.app");

// === Запуск/закрытие приложения ===
driver.activateApp("com.example.app");
driver.terminateApp("com.example.app");`
  };

  return (
    <Section title="Действия и жесты" icon="👆">
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Appium поддерживает множество действий: клики, ввод текста, свайпы, 
          жесты масштабирования и работу с системными функциями.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-2">👆 Базовые действия</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• click() — нажатие</li>
              <li>• sendKeys() — ввод текста</li>
              <li>• clear() — очистка поля</li>
              <li>• swipe — свайп</li>
              <li>• longPress — долгое нажатие</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-2">📱 Системные действия</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• hideKeyboard() — скрыть клавиатуру</li>
              <li>• openNotifications() — панель уведомлений</li>
              <li>• takeScreenshot() — скриншот</li>
              <li>• installApp() — установка приложения</li>
              <li>• switchContext() — смена контекста</li>
            </ul>
          </div>
        </div>

        <CodeBlock language={language} code={codeExamples[language]} />
      </div>
    </Section>
  );
}

function AdvancedSection({ language }: { language: 'javascript' | 'python' | 'java' }) {
  const codeExamples = {
    javascript: `// === Page Object Model ===
// pages/LoginPage.js
class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.usernameInput = driver.$('~username-input');
    this.passwordInput = driver.$('~password-input');
    this.loginButton = driver.$('~login-button');
    this.errorMessage = driver.$('~error-message');
  }

  async login(username, password) {
    await this.usernameInput.waitForDisplayed();
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitForDisplayed();
    return this.errorMessage.getText();
  }

  async isLoginFormDisplayed() {
    return this.usernameInput.isDisplayed();
  }
}

// === Explicit Waits ===
async function waitForElement(driver, selector, timeout = 10000) {
  const element = await driver.$(selector);
  await element.waitForDisplayed({ timeout });
  return element;
}

// === Retry Logic ===
async function retryAction(action, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

// === Parallel Execution ===
// wdio.conf.js
exports.config = {
  maxInstances: 3,
  capabilities: [{
    maxInstances: 2,
    capabilities: { platformName: 'Android', ... }
  }, {
    maxInstances: 1,
    capabilities: { platformName: 'iOS', ... }
  }]
};

// === Appium Inspector для отладки ===
// Используйте Appium Inspector для:
// - Просмотра дерева элементов
// - Генерации локаторов
// - Записи действий`,
    python: `# === Page Object Model ===
# pages/login_page.py
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def find(self, by, value):
        return self.wait.until(
            EC.presence_of_element_located((by, value))
        )

    def find_and_click(self, by, value):
        element = self.find(by, value)
        element.click()
        return element

    def find_and_type(self, by, value, text):
        element = self.find(by, value)
        element.clear()
        element.send_keys(text)
        return element


class LoginPage(BasePage):
    # Локаторы
    USERNAME = (AppiumBy.ACCESSIBILITY_ID, 'username-input')
    PASSWORD = (AppiumBy.ACCESSIBILITY_ID, 'password-input')
    LOGIN_BTN = (AppiumBy.ACCESSIBILITY_ID, 'login-button')
    ERROR_MSG = (AppiumBy.ACCESSIBILITY_ID, 'error-message')

    def login(self, username, password):
        self.find_and_type(*self.USERNAME, username)
        self.find_and_type(*self.PASSWORD, password)
        self.find_and_click(*self.LOGIN_BTN)

    def get_error_message(self):
        return self.find(*self.ERROR_MSG).text

    def is_login_form_displayed(self):
        return self.find(*self.USERNAME).is_displayed()


# === Декоратор для повторных попыток ===
import functools
import time

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

# Использование:
@retry(max_attempts=3, delay=2)
def test_flaky_element(driver):
    element = driver.find_element(
        AppiumBy.ACCESSIBILITY_ID, 'flaky-element'
    )
    assert element.is_displayed()


# === Генерация отчётов ===
# pytest --html=report.html --self-contained-html
# allure serve ./allure-results`,
    java: `// === Page Object Model ===
// src/main/java/pages/BasePage.java
package pages;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public abstract class BasePage {
    protected AppiumDriver driver;
    protected WebDriverWait wait;

    public BasePage(AppiumDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    protected WebElement find(By locator) {
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    protected void click(By locator) {
        find(locator).click();
    }

    protected void type(By locator, String text) {
        WebElement element = find(locator);
        element.clear();
        element.sendKeys(text);
    }
}

// src/main/java/pages/LoginPage.java
package pages;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;

public class LoginPage extends BasePage {
    // Локаторы
    private static final By USERNAME = 
        By.id("com.example.app:id/username_input");
    private static final By PASSWORD = 
        By.id("com.example.app:id/password_input");
    private static final By LOGIN_BTN = 
        By.id("com.example.app:id/login_button");
    private static final By ERROR_MSG = 
        By.id("com.example.app:id/error_message");

    public LoginPage(AppiumDriver driver) {
        super(driver);
    }

    public void login(String username, String password) {
        type(USERNAME, username);
        type(PASSWORD, password);
        click(LOGIN_BTN);
    }

    public String getErrorMessage() {
        return find(ERROR_MSG).getText();
    }

    public boolean isLoginFormDisplayed() {
        return find(USERNAME).isDisplayed();
    }
}

// === Retry с JUnit ===
import org.junit.jupiter.api.extension.ExtendWith;
import io.github.resilience4j.retry.annotation.Retry;

@ExtendWith(RetryExtension.class)
public class LoginTest {
    
    @org.junit.jupiter.api.Test
    @Retry(maxAttempts = 3, delay = 1000)
    void testLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("user@test.com", "password123");
        // assertions...
    }
}

// === Allure отчёты ===
// @Step аннотации для красивых отчётов
@io.qameta.allure.Step("Выполнить вход с логином {username}")
public void login(String username, String password) {
    type(USERNAME, username);
    type(PASSWORD, password);
    click(LOGIN_BTN);
}`
  };

  return (
    <Section title="Продвинутые техники" icon="🚀">
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Паттерны проектирования, повторные попытки, параллельное выполнение 
          и другие продвинутые подходы для надёжных тестов.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h4 className="font-semibold text-purple-300 mb-2">🏛️ Page Object Model</h4>
            <p className="text-gray-400 text-sm">
              Разделение логики тестов и локаторов. Каждая страница — отдельный класс.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h4 className="font-semibold text-purple-300 mb-2">🔄 Retry Pattern</h4>
            <p className="text-gray-400 text-sm">
              Автоматические повторные попытки для нестабильных элементов.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h4 className="font-semibold text-purple-300 mb-2">⚡ Parallel Execution</h4>
            <p className="text-gray-400 text-sm">
              Запуск тестов на нескольких устройствах одновременно.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h4 className="font-semibold text-purple-300 mb-2">📊 Reporting</h4>
            <p className="text-gray-400 text-sm">
              Allure отчёты с шагами, скриншотами и метаданными.
            </p>
          </div>
        </div>

        <CodeBlock language={language} code={codeExamples[language]} />
      </div>
    </Section>
  );
}

function BestPracticesSection() {
  return (
    <Section title="Best Practices" icon="✅">
      <div className="space-y-6">
        <div className="space-y-4">
          <PracticeCard
            emoji="🎯"
            title="Используйте Accessibility ID"
            description="Это самый стабильный локатор. Попросите разработчиков добавить contentDescription (Android) и accessibilityLabel (iOS)."
            type="do"
          />
          <PracticeCard
            emoji="⏳"
            title="Всегда используйте явные ожидания"
            description="Никогда не используйте sleep(). Используйте waitForDisplayed(), WebDriverWait и ExpectedConditions."
            type="do"
          />
          <PracticeCard
            emoji="🏛️"
            title="Применяйте Page Object Model"
            description="Разделяйте логику тестов от локаторов. Это упрощает поддержку при изменениях UI."
            type="do"
          />
          <PracticeCard
            emoji="📸"
            title="Делайте скриншоты при падении"
            description="Настройте автоматические скриншоты при failed тестах для быстрой диагностики."
            type="do"
          />
          <PracticeCard
            emoji="🔄"
            title="Добавьте retry для flaky тестов"
            description="Используйте retry механизм, но не злоупотребляйте — лучше починить корневую причину."
            type="do"
          />
          <PracticeCard
            emoji="❌"
            title="Не используйте XPath с индексами"
            description="Локаторы типа //div[3]/span[2] крайне хрупкие. Используйте уникальные атрибуты."
            type="dont"
          />
          <PracticeCard
            emoji="❌"
            title="Не хардкодьте таймауты"
            description="Используйте конфигурируемые таймауты вместо магических чисел."
            type="dont"
          />
          <PracticeCard
            emoji="❌"
            title="Не зависьте от состояния других тестов"
            description="Каждый тест должен быть независимым. Используйте before/after хуки для настройки состояния."
            type="dont"
          />
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-purple-300 mb-3">📚 Полезные ресурсы</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>📖 <a href="https://appium.io/docs/" className="text-purple-400 hover:underline" target="_blank" rel="noreferrer">Appium Official Documentation</a></li>
            <li>📖 <a href="https://webdriver.io/docs/appium/" className="text-purple-400 hover:underline" target="_blank" rel="noreferrer">WebdriverIO + Appium</a></li>
            <li>📖 <a href="https://github.com/appium/python-client" className="text-purple-400 hover:underline" target="_blank" rel="noreferrer">Appium Python Client</a></li>
            <li>📖 <a href="https://github.com/appium/java-client" className="text-purple-400 hover:underline" target="_blank" rel="noreferrer">Appium Java Client</a></li>
            <li>🔧 <a href="https://github.com/appium/appium-inspector" className="text-purple-400 hover:underline" target="_blank" rel="noreferrer">Appium Inspector</a></li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function PracticeCard({ emoji, title, description, type }: { emoji: string; title: string; description: string; type: 'do' | 'dont' }) {
  const borderColor = type === 'do' ? 'border-green-700/50' : 'border-red-700/50';
  const bgColor = type === 'do' ? 'bg-green-900/10' : 'bg-red-900/10';
  const labelColor = type === 'do' ? 'text-green-400' : 'text-red-400';
  const labelText = type === 'do' ? '✅ DO' : '❌ DON\'T';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4 flex gap-4`}>
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-white">{title}</h4>
          <span className={`text-xs font-bold ${labelColor}`}>{labelText}</span>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default App;