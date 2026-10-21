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
        'appium:deviceName': 'SM-A525F',       // ← ЗАМЕНИТЕ НА ИМЯ ВАШЕГО УСТРОЙСТВА
        'appium:udid': 'XXXXXXXX',             // ← ЗАМЕНИТЕ НА UDID ИЗ adb devices
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
    console.log(`📱 Размер экрана: ${width}x${height}`);

    // Центр экрана
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    console.log(`🎯 Кликаем в центр: (${centerX}, ${centerY})`);

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
        console.log(`✅ Клик ${i + 1}/${clicksCount}`);
      }
    }

    console.log(`🎉 Готово! Сделано ${clicksCount} кликов`);
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
        console.log(`🍪 Кликов: ${clickCount} | Время: ${elapsed.toFixed(1)}с | CPS: ${cps}`);
      }
    }
  });
});