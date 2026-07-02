import { test, expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

/** Идентификаторы ингредиентов из мок-данных HAR-файла. */
const BUN_ID = '60666c42cc7b410027a1a9b1';
const BUN_NAME = 'Краторная булка N-200i';
const FILLING_ID = '60666c42cc7b410027a1a9b5';
const FILLING_NAME = 'Говяжий метеорит (отбивная)';
// Номер заказа 78901 отображается с ведущими нулями до 6 знаков.
const ORDER_NUMBER = '078901';

/**
 * Перетаскивание для react-dnd с HTML5-бэкендом: библиотека слушает
 * нативные drag-события, поэтому имитируем их вручную с общим DataTransfer.
 */
const dragTo = async (page: Page, source: Locator, target: Locator): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent('dragstart', { dataTransfer });
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  await target.dispatchEvent('drop', { dataTransfer });
  await source.dispatchEvent('dragend', { dataTransfer });
};

const ingredientCard = (page: Page, id: string): Locator =>
  page.getByTestId(`ingredient-${id}`);
const burgerConstructor = (page: Page): Locator =>
  page.getByTestId('burger-constructor');
const modal = (page: Page): Locator => page.getByTestId('modal');
const modalOverlay = (page: Page): Locator => page.getByTestId('modal-overlay');
const modalClose = (page: Page): Locator => page.getByTestId('modal-close');
const orderButton = (page: Page): Locator =>
  page.getByRole('button', { name: 'Оформить заказ' });

/** Сборка минимального бургера: булка + начинка. */
const assembleBurger = async (page: Page): Promise<void> => {
  await dragTo(page, ingredientCard(page, BUN_ID), burgerConstructor(page));
  await dragTo(page, ingredientCard(page, FILLING_ID), burgerConstructor(page));
};

test.beforeEach(async ({ page }) => {
  // Мокируем все запросы к API через HAR-файл, остальные — обрываем.
  await page.routeFromHAR('e2e/fixtures/api.har', {
    url: '**/api/**',
    update: false,
    notFound: 'abort',
  });

  // Авторизуемся в обход UI логина (страницы авторизации исключены из теста
  // заказа по ТЗ): кладём токены в localStorage, а GET /auth/user замокирован.
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'Bearer test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/');
  await expect(ingredientCard(page, BUN_ID)).toBeVisible();
});

test.describe('Страница «Конструктор»', () => {
  test('перетаскивает булку и начинку в конструктор', async ({ page }) => {
    await expect(burgerConstructor(page)).toContainText('Выберите булки');

    await assembleBurger(page);

    await expect(burgerConstructor(page)).toContainText(`${BUN_NAME} (верх)`);
    await expect(burgerConstructor(page)).toContainText(`${BUN_NAME} (низ)`);
    await expect(burgerConstructor(page)).toContainText(FILLING_NAME);
  });

  test('открывает модальное окно с описанием ингредиента и показывает его данные', async ({
    page,
  }) => {
    await ingredientCard(page, BUN_ID).click();

    await expect(modal(page)).toBeVisible();
    await expect(modal(page)).toContainText('Детали ингредиента');
    // Данные ингредиента: название и пищевая ценность.
    await expect(modal(page)).toContainText(BUN_NAME);
    await expect(modal(page)).toContainText('Калории,ккал');
    await expect(modal(page)).toContainText('420');
    await expect(modal(page)).toContainText('Белки, г');
    await expect(modal(page)).toContainText('80');
  });

  test('закрывает модальное окно ингредиента по кнопке закрытия', async ({ page }) => {
    await ingredientCard(page, BUN_ID).click();
    await expect(modal(page)).toBeVisible();

    await modalClose(page).click();

    await expect(modal(page)).toBeHidden();
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({ page }) => {
    await ingredientCard(page, BUN_ID).click();
    await expect(modal(page)).toBeVisible();

    await modalOverlay(page).click({ position: { x: 5, y: 5 } });

    await expect(modal(page)).toBeHidden();
  });

  test('создаёт заказ и показывает его номер в модальном окне', async ({ page }) => {
    await assembleBurger(page);

    await expect(orderButton(page)).toBeEnabled();
    await orderButton(page).click();

    await expect(modal(page)).toBeVisible();
    await expect(modal(page)).toContainText(ORDER_NUMBER);
    await expect(modal(page)).toContainText('идентификатор заказа');
  });

  test('закрывает модальное окно заказа по кнопке закрытия', async ({ page }) => {
    await assembleBurger(page);

    await orderButton(page).click();
    await expect(modal(page)).toContainText(ORDER_NUMBER);

    await modalClose(page).click();

    await expect(modal(page)).toBeHidden();
  });
});
