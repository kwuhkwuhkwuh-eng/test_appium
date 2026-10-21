import CodeBlock from './CodeBlock';
import Section from './Section';

export default function ProjectStructure() {
  return (
    <Section title="Структура проекта" icon="📁">
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Правильная структура проекта — ключ к поддерживаемым тестам. 
          Вот рекомендуемая структура для Appium проекта:
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 font-mono text-sm">
          <div className="space-y-1">
            <FileTree name="appium-tests/" level={0} isFolder />
            <FileTree name="├── src/" level={1} isFolder />
            <FileTree name="│   ├── pages/" level={2} isFolder />
            <FileTree name="│   │   ├── BasePage.ts" level={3} desc="Базовый класс страницы" />
            <FileTree name="│   │   ├── LoginPage.ts" level={3} desc="Страница логина" />
            <FileTree name="│   │   ├── HomePage.ts" level={3} desc="Главная страница" />
            <FileTree name="│   │   └── ProfilePage.ts" level={3} desc="Страница профиля" />
            <FileTree name="│   ├── utils/" level={2} isFolder />
            <FileTree name="│   │   ├── driver.ts" level={3} desc="Инициализация драйвера" />
            <FileTree name="│   │   ├── waits.ts" level={3} desc="Утилиты ожидания" />
            <FileTree name="│   │   └── helpers.ts" level={3} desc="Вспомогательные функции" />
            <FileTree name="│   └── config/" level={2} isFolder />
            <FileTree name="│       ├── capabilities.ts" level={3} desc="Desired Capabilities" />
            <FileTree name="│       └── environments.ts" level={3} desc="Конфигурация окружений" />
            <FileTree name="├── tests/" level={1} isFolder />
            <FileTree name="│   ├── auth/" level={2} isFolder />
            <FileTree name="│   │   ├── login.spec.ts" level={3} desc="Тесты авторизации" />
            <FileTree name="│   │   └── registration.spec.ts" level={3} desc="Тесты регистрации" />
            <FileTree name="│   ├── profile/" level={2} isFolder />
            <FileTree name="│   │   └── profile.spec.ts" level={3} desc="Тесты профиля" />
            <FileTree name="│   └── smoke/" level={2} isFolder />
            <FileTree name="│       └── smoke.spec.ts" level={3} desc="Дымовые тесты" />
            <FileTree name="├── reports/" level={1} isFolder desc="Отчёты (allure, screenshots)" />
            <FileTree name="├── apps/" level={1} isFolder desc="APK/IPA файлы для тестов" />
            <FileTree name="├── wdio.conf.ts" level={1} desc="Конфигурация WebdriverIO" />
            <FileTree name="├── tsconfig.json" level={1} desc="TypeScript конфигурация" />
            <FileTree name="└── package.json" level={1} desc="Зависимости проекта" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h4 className="font-semibold text-white mb-3">📁 Папка pages/</h4>
            <p className="text-gray-400 text-sm mb-2">
              Page Objects — классы, представляющие экраны приложения.
              Каждый класс содержит:
            </p>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Локаторы элементов</li>
              <li>• Методы взаимодействия</li>
              <li>• Методы проверки состояния</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h4 className="font-semibold text-white mb-3">📁 Папка tests/</h4>
            <p className="text-gray-400 text-sm mb-2">
              Тестовые файлы, сгруппированные по функциональности:
            </p>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• auth/ — авторизация и регистрация</li>
              <li>• profile/ — профиль пользователя</li>
              <li>• smoke/ — дымовые тесты</li>
              <li>• e2e/ — сквозные сценарии</li>
            </ul>
          </div>
        </div>

        <CodeBlock
          language="bash"
          code={`# Создание структуры проекта
mkdir -p appium-tests/{src/{pages,utils,config},tests/{auth,profile,smoke},reports,apps}

# Инициализация npm проекта
cd appium-tests
npm init -y
npm install --save-dev @wdio/cli typescript ts-node
npm install --save-dev @wdio/local-runner @wdio/mocha-framework
npm install --save-dev appium appium-uiautomator2-driver

# Запуск конфигурации WebdriverIO
npx wdio config`}
        />
      </div>
    </Section>
  );
}

function FileTree({ name, level, isFolder, desc }: { name: string; level: number; isFolder?: boolean; desc?: string }) {
  const colors = isFolder ? 'text-blue-400' : 'text-gray-300';
  const icon = isFolder ? '📁' : '📄';
  
  return (
    <div className="flex items-center gap-2 hover:bg-gray-700/30 px-2 py-0.5 rounded">
      <span className="text-xs">{icon}</span>
      <span className={colors}>{name}</span>
      {desc && <span className="text-gray-600 text-xs ml-2">← {desc}</span>}
    </div>
  );
}