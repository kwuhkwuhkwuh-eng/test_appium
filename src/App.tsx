import { useState } from 'react';

type Step = 'setup' | 'config' | 'test' | 'run';

const codeSnippets: Record<Step, string> = {
  run: '',
  setup: `# 1. Установить Node.js (v18+)
# https://nodejs.org

# 2. Установить Appium
npm install -g appium

# 3. Установить драйвер для Android
appium driver install uiautomator2

# 4. Создать проект
mkdir cookie-clicker-bot && cd cookie-clicker-bot
npm init -y

# 5. Установить зависимости
npm install --save-dev webdriverio @wdio/cli typescript ts-node

# 6. Подключить реальное устройство
#    - Включить "Режим разработчика" на телефоне
#    - Включить "Отладка по USB"
#    - Подключить USB кабель
#    - Разрешить отладку на телефоне

# 7. Проверить подключение
adb devices
# Должно показать: XXXXXXXX  device

# 8. Узнать имя устройства (для конфига)
adb shell getprop ro.product.model
# Например: SM-A525F

# 9. Установить Cookie Clicker на устройство
adb install cookie-clicker.apk

# 10. Узнать package name и activity игры
adb shell dumpsys package com.optcookie.CookieClicker | grep -A 5 "android.intent.action.MAIN"
# Или просто:
adb shell pm list packages | grep cookie`,

  config: `// wdio.conf.ts
import type { Options } from '@wdio/types';

export const config: Options.WebdriverIO = {
  // Подключение к Appium
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  // Тестовые файлы
  specs: ['./tests/clicker.spec.ts'],
  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 300_000, // 5 минут на тест
  },

  // ⚡ Desired Capabilities для реального устройства
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'SM-A525F', // ← имя вашего устройства (adb shell getprop ro.product.model)
    'appium:udid': 'XXXXXXXX',       // ← серийный номер (adb devices)
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
};`,

  test: `// tests/clicker.spec.ts
import { remote } from 'webdriverio';

describe('🍪 Cookie Clicker Bot', () => {
  let driver: WebdriverIO.Browser;

  before(async () => {
    // Подключаемся к Appium серверу
    driver = await remote({
      hostname: '127.0.0.1',
      port: 4723,
      capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'SM-A525F',
        'appium:udid': 'XXXXXXXX', // ← ваш UDID
        'appium:appPackage': 'com.optcookie.CookieClicker',
        'appium:appActivity': 'com.optcookie.CookieClicker.MainActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 300,
      }
    });
  });

  after(async () => {
    // Закрываем сессию
    await driver.deleteSession();
  });

  it('🍪 должен кликать в центр экрана 100 раз', async () => {
    // Запускаем игру (если ещё не запущена)
    await driver.activateApp('com.optcookie.CookieClicker');
    
    // Ждём пока игра загрузится
    await driver.pause(3000);

    // Получаем размеры экрана
    const { width, height } = await driver.getWindowSize();
    console.log(\`📱 Размер экрана: \${width}x\${height}\`);

    // Центр экрана
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    console.log(\`🎯 Кликаем в центр: (\${centerX}, \${centerY})\`);

    // Кликаем 100 раз
    const clicksCount = 100;
    for (let i = 0; i < clicksCount; i++) {
      // Кликаем в центр экрана
      await driver.touchAction([
        { action: 'tap', x: centerX, y: centerY }
      ]);

      // Небольшая пауза между кликами (100мс)
      await driver.pause(100);

      // Логируем прогресс каждые 10 кликов
      if ((i + 1) % 10 === 0) {
        console.log(\`✅ Клик \${i + 1}/\${clicksCount}\`);
      }
    }

    console.log(\`🎉 Готово! Сделано \${clicksCount} кликов\`);
  });

  it('🍪 должен кликать бесконечно (до остановки)', async () => {
    await driver.activateApp('com.optcookie.CookieClicker');
    await driver.pause(3000);

    const { width, height } = await driver.getWindowSize();
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    let clickCount = 0;
    const startTime = Date.now();

    console.log('🚀 Начинаем бесконечный кликер...');
    console.log('⏹️  Остановить: Ctrl+C');

    // Кликаем пока не остановим
    while (true) {
      await driver.touchAction([
        { action: 'tap', x: centerX, y: centerY }
      ]);

      clickCount++;
      await driver.pause(50); // 50мс между кликами = 20 кликов/сек

      // Логируем каждые 100 кликов
      if (clickCount % 100 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const cps = (clickCount / elapsed).toFixed(1);
        console.log(\`🍪 Кликов: \${clickCount} | Время: \${elapsed.toFixed(1)}с | CPS: \${cps}\`);
      }
    }
  });
});`,
};

function App() {
  const [activeStep, setActiveStep] = useState<Step>('setup');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippets[activeStep]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps: { id: Step; label: string; icon: string; desc: string }[] = [
    { id: 'setup', label: 'Установка', icon: '⚙️', desc: 'Appium + подключение устройства' },
    { id: 'config', label: 'Конфиг', icon: '🔧', desc: 'Desired Capabilities' },
    { id: 'test', label: 'Тест', icon: '🍪', desc: 'Клик в центр экрана' },
    { id: 'run', label: 'Запуск', icon: '▶️', desc: 'Команды для запуска' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-600/20">
              🍪
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Cookie Clicker Bot
              </h1>
              <p className="text-sm text-gray-500">
                Автотест: кликаем в центр экрана на реальном Android устройстве
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex flex-col items-start p-4 rounded-xl text-left transition-all ${
                activeStep === step.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{step.icon}</span>
                <span className="text-xs font-bold opacity-60">Шаг {i + 1}</span>
              </div>
              <div className="font-semibold text-sm">{step.label}</div>
              <div className="text-xs opacity-70 mt-1">{step.desc}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeStep === 'setup' && <SetupSection />}
        {activeStep === 'config' && <ConfigSection />}
        {activeStep === 'test' && <TestSection />}
        {activeStep === 'run' && <RunSection />}

        {/* Code block */}
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
                  {activeStep === 'setup' && 'terminal'}
                  {activeStep === 'config' && 'wdio.conf.ts'}
                  {activeStep === 'test' && 'tests/clicker.spec.ts'}
                  {activeStep === 'run' && 'commands'}
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
                  {codeSnippets[activeStep].split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="inline-block w-8 text-right mr-5 text-gray-700 select-none text-xs">
                        {i + 1}
                      </span>
                      <span className="flex-1">
                        <CodeLine line={line} isBash={activeStep === 'setup'} />
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SetupSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Что нужно"
        items={[
          { icon: '📱', text: 'Реальное Android устройство с USB кабелем' },
          { icon: '🍪', text: 'Игра Cookie Clicker (установлена на устройстве)' },
          { icon: '🔧', text: 'Режим разработчика + Отладка по USB включены' },
          { icon: '💻', text: 'Компьютер с Node.js 18+ и Android SDK' },
        ]}
      />

      <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <span>📱</span> Как включить отладку по USB
        </h4>
        <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
          <li>Настройки → О телефоне → 7 раз тапнуть на "Номер сборки"</li>
          <li>Появится "Режим разработчика"</li>
          <li>Настройки → Система → Для разработчиков</li>
          <li>Включить "Отладка по USB"</li>
          <li>Подключить USB кабель к компьютеру</li>
          <li>На телефоне разрешить отладку (появится диалог)</li>
        </ol>
      </div>

      <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
          <span>🍪</span> Package name игры Cookie Clicker
        </h4>
        <p className="text-gray-400 text-sm mb-3">
          Обычно это <code className="bg-gray-800 px-2 py-0.5 rounded text-amber-400">com.optcookie.CookieClicker</code>
        </p>
        <p className="text-gray-400 text-sm">
          Узнать точно можно командой:
        </p>
        <CodeBlock
          code={`# Найти package name игры
adb shell pm list packages | grep cookie

# Или если игра открыта:
adb shell dumpsys activity | grep "mResumedActivity"`}
        />
      </div>
    </div>
  );
}

function ConfigSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Ключевые параметры для вашего устройства"
        items={[
          { icon: '📱', text: 'deviceName — модель телефона (adb shell getprop ro.product.model)' },
          { icon: '🔢', text: 'udid — серийный номер (adb devices)' },
          { icon: '🍪', text: 'appPackage — com.optcookie.CookieClicker' },
          { icon: '🎯', text: 'appActivity — .MainActivity (или узнать через dumpsys)' },
          { icon: '✅', text: 'noReset: true — не сбрасывать прогресс игры' },
        ]}
      />

      <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
          <span>💡</span> Как узнать appActivity?
        </h4>
        <CodeBlock
          code={`# Открыть Cookie Clicker на телефоне, затем:
adb shell dumpsys activity | grep "mResumedActivity"

# Результат будет примерно такой:
# mResumedActivity: ActivityRecord {abc} com.optcookie.CookieClicker/.MainActivity
#                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#                   appPackage                              appActivity`}
        />
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-3">📝 Замените в конфиге:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <code className="text-orange-400 shrink-0">SM-A525F</code>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">имя вашего устройства</span>
          </div>
          <div className="flex items-start gap-2">
            <code className="text-orange-400 shrink-0">XXXXXXXX</code>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">серийный номер из adb devices</span>
          </div>
          <div className="flex items-start gap-2">
            <code className="text-orange-400 shrink-0">.MainActivity</code>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">activity из dumpsys (если отличается)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestSection() {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Что делает тест"
        items={[
          { icon: '1️⃣', text: 'Подключается к Appium серверу' },
          { icon: '2️⃣', text: 'Запускает Cookie Clicker' },
          { icon: '3️⃣', text: 'Получает размеры экрана' },
          { icon: '4️⃣', text: 'Вычисляет центр экрана (width/2, height/2)' },
          { icon: '5️⃣', text: 'Кликает в центр 100 раз (или бесконечно)' },
        ]}
      />

      <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-purple-300 mb-3">🎯 Как работает клик в центр</h4>
        <div className="bg-gray-900/60 rounded-lg p-4">
          <div className="text-center text-sm text-gray-400 mb-3">
            Схема экрана телефона:
          </div>
          <div className="relative w-48 h-80 mx-auto border-2 border-gray-600 rounded-lg bg-gray-800/50">
            {/* Grid lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-gray-700" />
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gray-700" />
            </div>
            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50" />
            </div>
            {/* Labels */}
            <div className="absolute top-2 left-2 text-xs text-gray-500">0,0</div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">W,H</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-6 text-xs text-orange-400 whitespace-nowrap">
              (W/2, H/2)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-3">⚡ Два режима теста</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-blue-400 mb-2">🎯 Тест 1: 100 кликов</div>
            <p className="text-xs text-gray-500">
              Кликает 100 раз с паузой 100мс между кликами.
              Подходит для проверки работоспособности.
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-sm font-semibold text-green-400 mb-2">🚀 Тест 2: Бесконечный</div>
            <p className="text-xs text-gray-500">
              Кликает бесконечно с паузой 50мс (20 кликов/сек).
              Остановить: Ctrl+C
            </p>
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
        title="Порядок запуска"
        items={[
          { icon: '1️⃣', text: 'Подключить телефон по USB, проверить: adb devices' },
          { icon: '2️⃣', text: 'Запустить Appium сервер: appium' },
          { icon: '3️⃣', text: 'Открыть Cookie Clicker на телефоне (или тест откроет сам)' },
          { icon: '4️⃣', text: 'Запустить тест: npx wdio run ./wdio.conf.ts' },
          { icon: '5️⃣', text: 'Смотреть как бот кликает в центре экрана 🍪' },
        ]}
      />

      <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-5">
        <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
          <span>▶️</span> Команды для запуска
        </h4>
        <div className="space-y-3">
          <CommandBlock
            label="Запустить Appium сервер"
            command="appium"
          />
          <CommandBlock
            label="Запустить тест (100 кликов)"
            command="npx wdio run ./wdio.conf.ts --mochaOpts.grep '100 раз'"
          />
          <CommandBlock
            label="Запустить бесконечный кликер"
            command="npx wdio run ./wdio.conf.ts --mochaOpts.grep 'бесконечно'"
          />
          <CommandBlock
            label="Запустить все тесты"
            command="npx wdio run ./wdio.conf.ts"
          />
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-3">🐛 Если что-то не работает</h4>
        <div className="space-y-2 text-sm">
          <DebugTip command="adb devices" desc="Устройство должно быть в списке" />
          <DebugTip command="adb shell input tap 500 1000" desc="Тестовый клик (проверяет что adb работает)" />
          <DebugTip command="adb shell wm size" desc="Узнать реальный размер экрана" />
          <DebugTip command="appium --log-level debug" desc="Подробные логи Appium" />
          <DebugTip command="adb logcat" desc="Логи Android в реальном времени" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-700/40 rounded-xl p-6">
        <h4 className="font-semibold text-orange-300 mb-3">🎉 Готово!</h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          Теперь у вас есть бот для Cookie Clicker! 
          Он кликает в центр экрана на реальном устройстве.
          Можно менять количество кликов, скорость, или добавить рандомизацию координат.
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
    <div className="bg-gray-900/60 rounded-lg p-4 overflow-x-auto mt-2">
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
        if (i === 0 && ['npm', 'appium', 'adb', 'npx', 'mkdir', 'cd'].includes(part)) {
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
  const strings = /(['"`])(?:(?=(\\?))\2.)*?\1/g;
  const stringMatches: { start: number; end: number; text: string }[] = [];
  let match;

  while ((match = strings.exec(line)) !== null) {
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
  const keywords = ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'async', 'await', 'return', 'class', 'private', 'get', 'new', 'if', 'else', 'for', 'describe', 'it', 'before', 'beforeEach', 'expect', 'while', 'true', 'false'];
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return <span key={i} className="text-purple-400">{part}</span>;
        }
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