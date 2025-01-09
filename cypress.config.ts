import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // Указание базового URL для вашего приложения
    env: {
      BURGER_API_URL: 'https://norma.nomoreparties.space/api' // Пример переменной окружения
    },
    setupNodeEvents(on, config) {
      // Здесь можно настроить обработку событий
    }
  }
});
