# 🍪 Cookie Clicker Bot

Автотест на Appium для игры Cookie Clicker на реальном Android устройстве.
Кликает в центр экрана, собирая печеньки автоматически.

## 📋 Требования

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **Java JDK** 17+ → [adoptium.net](https://adoptium.net)
- **Android SDK** → через Android Studio
- **Реальное Android устройство** с USB кабелем
- **Игра Cookie Clicker** установленная на устройстве

## 🚀 Быстрый старт

### 1. Клонировать и установить зависимости

```bash
cd cookie-clicker-bot
npm install
```

### 2. Установить Appium и драйвер

```bash
npm install -g appium
appium driver install uiautomator2
```

### 3. Подготовить устройство

1. На телефоне: **Настройки → О телефоне** → 7 раз тапнуть на **"Номер сборки"**
2. **Настройки → Система → Для разработчиков** → включить **"Отладка по USB"**
3. Подключить телефон по USB
4. Разрешить отладку на телефоне (появится диалог)

### 4. Узнать данные устройства

```bash
# Список подключённых устройств
adb devices
# Результат: XXXXXXXX  device  ← это ваш UDID

# Модель устройства
adb shell getprop ro.product.model
# Результат: SM-A525F  ← это ваш deviceName

# Package name игры (если игра открыта)
adb shell dumpsys activity | grep "mResumedActivity"
```

### 5. Настроить конфигурацию

Откройте `wdio.conf.ts` и `tests/clicker.spec.ts`, замените:

```
SM-A525F  →  ваша модель устройства
XXXXXXXX  →  ваш UDID из adb devices
```

### 6. Запустить!

```bash
# Терминал 1: запускаем Appium сервер
appium

# Терминал 2: запускаем тест
npm run test:100        # 100 кликов
# или
npm run test:infinite   # бесконечный кликер
```

## 📁 Структура проекта

```
cookie-clicker-bot/
├── tests/
│   └── clicker.spec.ts    ← тесты (клик в центр экрана)
├── wdio.conf.ts           ← конфигурация WebdriverIO
├── tsconfig.json          ← настройки TypeScript
├── package.json           ← зависимости
└── README.md              ← этот файл
```

## 🎮 Режимы теста

| Команда | Описание |
|---------|----------|
| `npm run test:100` | 100 кликов в центр экрана (пауза 100мс) |
| `npm run test:infinite` | Бесконечный кликер (20 кликов/сек, Ctrl+C для остановки) |
| `npm run test` | Запустить все тесты |

## 🐛 Отладка

```bash
# Проверить подключение устройства
adb devices

# Тестовый клик через adb (без Appium)
adb shell input tap 540 1200

# Размер экрана
adb shell wm size

# Логи устройства
adb logcat

# Логи Appium (подробные)
appium --log-level debug

# Текущая активность
adb shell dumpsys activity | grep "mResumedActivity"
```

## ⚙️ Настройка скорости кликов

В `tests/clicker.spec.ts` измените параметр `pause`:

```typescript
await driver.pause(50);   // 50мс = 20 кликов/сек (быстро)
await driver.pause(100);  // 100мс = 10 кликов/сек (средне)
await driver.pause(200);  // 200мс = 5 кликов/сек (медленно)
```

## ❓ Частые проблемы

**Устройство не видно в `adb devices`:**
- Проверьте USB кабель (должен поддерживать передачу данных)
- Перевыключите отладку по USB
- Установите драйверы для вашего устройства

**Ошибка "appActivity not found":**
```bash
# Узнать правильную activity
adb shell dumpsys package com.optcookie.CookieClicker | grep -A 5 "android.intent.action.MAIN"
```

**Клики не попадают куда надо:**
```bash
# Узнать реальный размер экрана
adb shell wm size
# Вручную проверить клик
adb shell input tap 540 1200
```
