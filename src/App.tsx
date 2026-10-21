import { useState } from 'react';

type Tab = 'test' | 'page-object' | 'config' | 'setup' | 'run';

const codeSnippets: Record<Tab, string> = {
  run: '',
  setup: `# 1. Установить Node.js (v18+)
# https://nodejs.org

# 2. Установить Appium глобально
npm install -g appium

# 3. Установить драйвер для Android
appium driver install uiautomator2

# 4. Проверить
appium --version
appium driver list --installed

# 5. Запустить Appium сервер
appium
# → Appium REST http interface listener started on 0.0.0.0:4723`,

  config: `// wdio.conf.ts
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
    timeout: 60_000,
  },

  // ⚡ Desired Capabilities для Android
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '14.0',
    'appium:app': './apps/my-app.apk',
    'appium:appPackage': 'com.example.myapp',
    'appium:appActivity': '.MainActivity',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:newCommandTimeout': 240,
  }],

  reporters: ['spec'],

  // Скриншот при падении
  afterTest: async function (_, __, { error }) {
    if (error) {
      await browser.saveScreenshot(
        \`./screenshots/error-\${Date.now()}.png\`
      );
    }
  },

  logLevel: 'info',
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
};`,

  'page-object': `// src/pages/LoginPage.ts
import { ChainablePromiseElement } from 'webdriverio';

class LoginPage {
  // === Локаторы ===
  // Используем accessibility-id (contentDescription в Android)
  private get usernameInput()  { return $('~username-input'); }
  private get passwordInput()  { return $('~password-input'); }
  private get loginButton()    { return $('~login-button'); }
  private get errorMessage()   { return $('~error-message'); }
  private get progressBar()    { return $('~progress-bar'); }

  // Также можно искать по resource-id:
  // private get usernameInput() {
  //   return $('android=new UiSelector().resourceId("com.example.myapp:id/username")');
  // }

  // === Действия ===
  async open() {
    // Если app не указан в capabilities — запускаем вручную
    await driver.activateApp('com.example.myapp');
  }

  async login(username: string, password: string) {
    await this.usernameInput.waitForDisplayed({ timeout: 10_000 });
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async waitForLoading() {
    await this.progressBar.waitForDisplayed({ timeout: 5_000 });
    await this.progressBar.waitForDisplayed({ 
      timeout: 15_000, 
      reverse: true  // ждём пока исчезнет
    });
  }

  // === Проверки ===
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitForDisplayed();
    return this.errorMessage.getText();
  }

  async isLoginFormDisplayed(): Promise<boolean> {
    return this.usernameInput.isDisplayed();
  }
}

export default new LoginPage();`,

  test: `// tests/login.spec.ts
import loginPage from '../src/pages/LoginPage';

describe('🔐 Авторизация', () => {

  before(async () => {
    // Перед всеми тестами — открываем приложение
    await loginPage.open();
  });

  beforeEach(async () => {
    // Перед каждым тестом — перезапускаем активность
    await driver.reset();
  });

  it('✅ должен войти с валидными данными', async () => {
    // Act
    await loginPage.login('testuser@mail.com', 'Password123!');
    await loginPage.waitForLoading();

    // Assert — проверяем что попали на главный экран
    const homeScreen = await $('~home-screen');
    await expect(homeScreen).toBeDisplayed();

    // Проверяем текст приветствия
    const greeting = await $('~greeting-text');
    await expect(greeting).toHaveText('Привет, Тест!');
  });

  it('❌ должен показать ошибку при неверном пароле', async () => {
    // Act
    await loginPage.login('testuser@mail.com', 'wrongpassword');

    // Assert
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Неверный логин или пароль');
  });

  it('❌ должен показать ошибку при пустых полях', async () => {
    // Act — просто нажимаем кнопку входа
    const loginBtn = await $('~login-button');
    await loginBtn.click();

    // Assert
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Заполните все поля');
  });

  it('🔒 должен блокировать после 5 неверных попыток', async () => {
    // Act — 5 раз вводим неверный пароль
    for (let i = 0; i < 5; i++) {
      await loginPage.login('testuser@mail.com', 'wrong');
      await driver.reset();
      await loginPage.open();
    }

    // 6-я попытка
    await loginPage.login('testuser@mail.com', 'Password123!');

    // Assert — аккаунт заблокирован
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Аккаунт заблокирован');
    
    const lockIcon = await $('~lock-icon');
    await expect(lockIcon).toBeDisplayed();
  });
});`,
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('setup');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'setup', label: 'Установка', icon: '⚙️' },
    { id: 'config', label: 'Конфиг', icon: '🔧' },
    { id: 'page-object', label: 'Page Object', icon: '📄' },
    { id: 'test', label: 'Тест', icon: '🧪' },
    { id: 'run', label: 'Запуск', icon: '▶️' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-600/20">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Appium × Android
                </h1>
                <p className="text-sm text-gray-500">
                  Автотест мобильного приложения • WebdriverIO + TypeScript
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md border border-green-800/50">Android</span>
              <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-md border border-blue-800/50">UiAutomator2</span>
              <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-md border border-yellow-800/50">TypeScript</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {i < tabs.length - 1 && (
                <span className="text-gray-600 ml-1 hidden sm:inline">→</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'setup' && <SetupSection />}
        {activeTab === 'config' && <ConfigSection />}
        {activeTab === 'page-object' && <PageObjectSection />}
        {activeTab === 'test' && <TestSection />}
        {activeTab === 'run' && <RunSection />}

        {/* Code block */}
        {activeTab !== 'run' && (
          <div className="mt-6">
            <div className="relative rounded-xl overflow-hidden border border-gray-800">
              {/* Code header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {activeTab === 'setup' && 'terminal'}
                    {activeTab === 'config' && 'wdio.conf.ts'}
                    {activeTab === 'page-object' && 'src/pages/LoginPage.ts'}
                    {activeTab === 'test' && 'tests/login.spec.ts'}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  {copied ? (
                    <>
                      <CheckIcon /> Скопировано!
                    </>
                  ) : (
                    <>
                      <CopyIcon /> Копировать
                    </>
                  )}
                </button>
              </div>

              {/* Code content */}
              <div className="overflow-x-auto">
                <pre className="p-5 text-sm leading-relaxed">
                  <code className="text-gray-300 font-mono">
                    {codeSnippets[activeTab].split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="inline-block w-8 text-right mr-5 text-gray-700 select-none text-xs">
                          {i + 1}
                        </span>
                        <span className="flex-1">
                          <CodeLine line={line} isBash={activeTab === 'setup'} />
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SetupSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Что нужно для старта"
        items={[
          { icon: '📱', text: 'Android эмулятор или реальное устройство' },
          { icon: '☕', text: 'Java JDK 17+ (для Android SDK)' },
          { icon: '📦', text: 'Android SDK (через Android Studio)' },
          { icon: '🟢', text: 'Node.js 18+ (для Appium и WebdriverIO)' },
          { icon: '🤖', text: 'APK файл тестируемого приложения' },
        ]}
      />

      <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
          <span>⚠️</span> Как узнать appPackage и appActivity?
        </h4>
        <CodeBlock
          code={`# Запустить приложение на устройстве, затем:
adb shell dumpsys activity | grep "mResumedActivity"

# Результат:
# mResumedActivity: ActivityRecord {abc} com.example.myapp/.MainActivity
#                   ^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^
#                   appPackage           appActivity

# Или из APK файла:
aapt dump badging my-app.apk | grep "package:"
aapt dump badging my-app.apk | grep "launchable-activity"`}
        />
      </div>

      <InfoCard
        title="Инициализация проекта"
        items={[
          { icon: '📁', text: 'mkdir android-tests && cd android-tests' },
          { icon: '📦', text: 'npm init -y' },
          { icon: '📦', text: 'npm i -D @wdio/cli typescript ts-node' },
          { icon: '📦', text: 'npm i -D @wdio/local-runner @wdio/mocha-framework' },
          { icon: '📦', text: 'npm i -D appium appium-uiautomator2-driver' },
          { icon: '⚙️', text: 'npx wdio config (выбрать mocha, spec reporter)' },
        ]}
      />
    </div>
  );
}

function ConfigSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Desired Capabilities — ключевые параметры"
        items={[
          { icon: '📱', text: 'deviceName — имя эмулятора (adb devices)' },
          { icon: '📦', text: 'app — путь к APK файлу' },
          { icon: '🏷️', text: 'appPackage — package name приложения' },
          { icon: '🎯', text: 'appActivity — activity для запуска' },
          { icon: '✅', text: 'autoGrantPermissions — авто-разрешения' },
          { icon: '🔄', text: 'noReset — не сбрасывать данные приложения' },
        ]}
      />

      <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <span>💡</span> Как найти deviceName?
        </h4>
        <CodeBlock
          code={`# Список подключённых устройств
adb devices

# Результат:
# List of devices attached
# emulator-5554    device     ← это deviceName для эмулятора
# ABCDEF123456     device     ← это deviceName для реального устройства

# Для эмулятора в Android Studio:
# Pixel_6_API_34, Medium_Phone_API_34, и т.д.`}
        />
      </div>
    </div>
  );
}

function PageObjectSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Почему Page Object?"
        items={[
          { icon: '🏛️', text: 'Локаторы в одном месте — легко менять' },
          { icon: '🔁', text: 'Переиспользование методов между тестами' },
          { icon: '📖', text: 'Тесты читаются как бизнес-логика' },
          { icon: '🛡️', text: 'Встроенные ожидания — меньше flaky тестов' },
        ]}
      />

      <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-purple-300 mb-3">🎯 Способы найти элемент на Android</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LocatorCard
            priority={1}
            name="Accessibility ID"
            code="~my-button"
            desc="contentDescription в XML"
            recommended
          />
          <LocatorCard
            priority={2}
            name="Android UIAutomator"
            code='android=new UiSelector().resourceId("com.app:id/btn")'
            desc="По resource-id"
          />
          <LocatorCard
            priority={3}
            name="ID"
            code="com.example.myapp:id/username"
            desc="Прямой resource-id"
          />
          <LocatorCard
            priority={4}
            name="XPath"
            code='//android.widget.Button[@text="Войти"]'
            desc="Хрупкий, избегать"
          />
        </div>
      </div>

      <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
          <span>🔍</span> Appium Inspector — для поиска локаторов
        </h4>
        <p className="text-gray-400 text-sm">
          Скачайте <a href="https://github.com/appium/appium-inspector" className="text-purple-400 underline" target="_blank" rel="noreferrer">Appium Inspector</a> — 
          визуальный инструмент для просмотра дерева элементов и генерации локаторов.
        </p>
      </div>
    </div>
  );
}

function TestSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Что проверяют эти тесты"
        items={[
          { icon: '✅', text: 'Вход с валидными данными → попадаем на главный экран' },
          { icon: '❌', text: 'Неверный пароль → сообщение об ошибке' },
          { icon: '❌', text: 'Пустые поля → валидация формы' },
          { icon: '🔒', text: '5 неверных попыток → блокировка аккаунта' },
        ]}
      />

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-3">📐 Структура теста (AAA)</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🎬</div>
            <div className="text-sm font-semibold text-blue-400">Arrange</div>
            <div className="text-xs text-gray-500 mt-1">Подготовка данных</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm font-semibold text-yellow-400">Act</div>
            <div className="text-xs text-gray-500 mt-1">Выполняем действие</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-semibold text-green-400">Assert</div>
            <div className="text-xs text-gray-500 mt-1">Проверяем результат</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RunSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Пошаговый запуск"
        items={[
          { icon: '1️⃣', text: 'Запустить эмулятор (Android Studio → Device Manager)' },
          { icon: '2️⃣', text: 'Запустить Appium сервер: appium' },
          { icon: '3️⃣', text: 'Положить APK в папку ./apps/' },
          { icon: '4️⃣', text: 'Проверить подключение: adb devices' },
          { icon: '5️⃣', text: 'Запустить тесты: npx wdio run ./wdio.conf.ts' },
        ]}
      />

      <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
          <span>▶️</span> Команды для запуска
        </h4>
        <div className="space-y-3">
          <CommandBlock
            label="Запустить все тесты"
            command="npx wdio run ./wdio.conf.ts"
          />
          <CommandBlock
            label="Только тесты авторизации"
            command="npx wdio run ./wdio.conf.ts --spec tests/login.spec.ts"
          />
          <CommandBlock
            label="Только один тест (по имени)"
            command='npx wdio run ./wdio.conf.ts --mochaOpts.grep "должен войти"'
          />
          <CommandBlock
            label="Параллельно на 2 устройствах"
            command="npx wdio run ./wdio.conf.ts --maxInstances 2"
          />
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-3">🐛 Отладка</h4>
        <div className="space-y-2 text-sm">
          <DebugTip command="adb logcat" desc="Логи устройства в реальном времени" />
          <DebugTip command="adb shell dumpsys activity" desc="Текущая активность" />
          <DebugTip command="adb shell pm list packages" desc="Список установленных пакетов" />
          <DebugTip command="adb install app.apk" desc="Установить APK вручную" />
          <DebugTip command="appium --log-level debug" desc="Подробные логи Appium" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/40 rounded-xl p-6">
        <h4 className="font-semibold text-green-300 mb-3">🎉 Готово!</h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          Теперь у вас есть рабочий автотест для Android приложения. 
          Следующие шаги: добавить больше Page Objects, подключить Allure отчёты, 
          настроить CI/CD (GitHub Actions / Jenkins) для автозапуска.
        </p>
      </div>
    </div>
  );
}

// === Helper Components ===

function InfoCard({ title, items }: { title: string; items: { icon: string; text: string }[] }) {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-lg mt-0.5">{item.icon}</span>
            <span className="text-gray-300 text-sm">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LocatorCard({ priority, name, code, desc, recommended }: {
  priority: number; name: string; code: string; desc: string; recommended?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${recommended ? 'bg-green-900/30 border border-green-700/40' : 'bg-gray-900/50 border border-gray-800'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold text-gray-500">#{priority}</span>
        <span className="text-sm font-semibold text-white">{name}</span>
        {recommended && <span className="text-xs text-green-400">⭐</span>}
      </div>
      <code className="text-xs text-purple-300 block mb-1 break-all">{code}</code>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}

function CommandBlock({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-gray-900/60 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      <code className="text-sm text-green-400 font-mono">$ {command}</code>
    </div>
  );
}

function DebugTip({ command, desc }: { command: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-900/40 rounded-lg px-3 py-2">
      <code className="text-yellow-400 text-xs font-mono shrink-0">{command}</code>
      <span className="text-gray-500 text-xs">— {desc}</span>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-gray-900/60 rounded-lg p-4 overflow-x-auto">
      <pre className="text-xs text-gray-300 font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function CodeLine({ line, isBash }: { line: string; isBash: boolean }) {
  if (isBash) {
    if (line.trim().startsWith('#')) {
      return <span className="text-gray-600 italic">{line}</span>;
    }
    return <span>{highlightBash(line)}</span>;
  }

  // TypeScript/JS
  if (line.trim().startsWith('//')) {
    return <span className="text-gray-600 italic">{line}</span>;
  }

  return <span>{highlightTS(line)}</span>;
}

function highlightBash(line: string) {
  const parts = line.split(/(\s+)/);
  return (
    <>
      {parts.map((part, i) => {
        if (i === 0 && ['npm', 'appium', 'adb', 'npx', 'aapt', 'mkdir', 'cd'].includes(part)) {
          return <span key={i} className="text-green-400">{part}</span>;
        }
        if (part.startsWith('-') || part.startsWith('--')) {
          return <span key={i} className="text-yellow-400">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function highlightTS(line: string) {
  const keywords = /\b(import|from|export|default|const|let|var|async|await|return|class|private|get|new|if|else|for|describe|it|before|beforeEach|expect|Promise)\b/g;
  const types = /\b(string|boolean|number|void|Promise|ChainablePromiseElement)\b/g;
  const strings = /(['"`])(?:(?=(\\?))\2.)*?\1/g;

  // Simple approach: split by strings first, then highlight keywords
  const segments: (string | { text: string; cls: string })[] = [];
  let remaining = line;
  let match;

  // Find all strings
  const stringMatches: { start: number; end: number; text: string }[] = [];
  const strRegex = /(['"`])(?:(?=(\\?))\2.)*?\1/g;
  while ((match = strRegex.exec(line)) !== null) {
    stringMatches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }

  if (stringMatches.length === 0) {
    return <span>{highlightKeywords(line)}</span>;
  }

  const result: JSX.Element[] = [];
  let lastIdx = 0;

  stringMatches.forEach((sm, i) => {
    if (sm.start > lastIdx) {
      result.push(<span key={`k${i}`}>{highlightKeywords(line.slice(lastIdx, sm.start))}</span>);
    }
    result.push(<span key={`s${i}`} className="text-green-400">{sm.text}</span>);
    lastIdx = sm.end;
  });

  if (lastIdx < line.length) {
    result.push(<span key="last">{highlightKeywords(line.slice(lastIdx))}</span>);
  }

  return <>{result}</>;
}

function highlightKeywords(text: string) {
  const keywords = ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'async', 'await', 'return', 'class', 'private', 'get', 'new', 'if', 'else', 'for', 'describe', 'it', 'before', 'beforeEach', 'expect'];
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return <span key={i} className="text-purple-400">{part}</span>;
        }
        // numbers
        if (/^\d[\d_]*$/.test(part)) {
          return <span key={i} className="text-orange-400">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default App;