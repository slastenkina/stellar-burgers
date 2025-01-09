import * as mockOrderResponse from '../fixtures/order.json';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запросы на ингредиенты и авторизацию
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    // Открываем главную страницу
    cy.visit('/');
  });

  it('Должен загружать ингредиенты и отображать их на странице', () => {
    // Проверяем, что на странице отображаются ингредиенты
    cy.get('[data-testid="bun"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="main"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="sauce"]').should('have.length.greaterThan', 0);
  });

  it('Должен добавлять ингредиент в конструктор', () => {
    // Проверяем добавление булки
    cy.get('[data-testid="bun"]:first-of-type button').click();
    cy.get('[data-testid="constructor-bun"]').should('exist'); // Убедимся, что булка добавлена
  });

  it('Должен открывать и закрывать модальное окно ингредиента', () => {
    // Кликаем на первый ингредиент
    cy.get('[data-testid="bun"]').first().click();

    // Проверяем, что в контейнере с модальными окнами есть хотя бы 1 дочерний элемент (модальное окно открылось)
    cy.get('#modals').children().should('have.length.greaterThan', 0);

    // Закрытие по кнопке "крестик"
    cy.get('#modals button:first-of-type').click();
    cy.get('#modals').children().should('have.length', 0);
  });

  it('Должен закрывать модальное окно по клику на оверлей', () => {
    // Кликаем на первый ингредиент
    cy.get('[data-testid="bun"]').first().click();

    // Проверяем открытие модального окна
    cy.get('#modals').children().should('have.length.greaterThan', 0);

    // Закрытие по клику на оверлей
    cy.get('#modals>div:nth-of-type(2)').click({ force: true });
    cy.get('#modals').children().should('have.length', 0);
  });

  it('Должен закрывать модальное окно по нажатию на Escape', () => {
    // Кликаем на первый ингредиент
    cy.get('[data-testid="bun"]').first().click();

    // Проверяем, что модальное окно открылось
    cy.get('#modals').children().should('have.length.greaterThan', 0);

    // Нажимаем клавишу Escape
    cy.get('body').type('{esc}');

    // Проверяем, что модальное окно закрылось
    cy.get('#modals').children().should('have.length', 0);
  });
});

describe('Оформление заказа после авторизации', () => {
  beforeEach(() => {
    // Устанавливаем фейковые токены авторизации в localStorage и cookies перед оформлением заказа
    cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
    localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

    // Перехватываем запросы для авторизации, создания заказа и получения ингредиентов
    cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
    cy.intercept('POST', 'api/orders', { fixture: 'order' });
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    cy.visit('/');
  });

  it('Должен оформлять заказ и показывать номер заказа', () => {
    cy.contains('button', 'Оформить заказ').should('be.disabled');
    // Добавляем булку
    cy.get('[data-testid="bun"]:first-of-type button').click();
    // Добавляем начинку
    cy.get('[data-testid="main"]:first-of-type button').click();
    // Добавляем соус
    cy.get('[data-testid="sauce"]:first-of-type button').click();

    // Оформляем заказ
    cy.contains('button', 'Оформить заказ').click();

    // Проверяем, что открывается модальное окно с оформлением заказа
    cy.get('#modals').children().should('have.length.greaterThan', 0);
    // Проверяем, что номер заказа отображается в модальном окне
    cy.get('#modals h2:first-of-type').should(
      'contain.text',
      mockOrderResponse.order.number
    );

    // Проверяем, что конструктор очищен и кнопка оформления заказа неактивна
    cy.get('#modals button:first-of-type').click();
    cy.get('[data-testid="constructor-item"]').should('have.length', 0);
    cy.contains('button', 'Оформить заказ').should('be.disabled');
  });

  afterEach(() => {
    // Очищаем фейковые токены после выполнения теста
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});
