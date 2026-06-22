import { createAction } from '@reduxjs/toolkit';

import type { OrdersFeedMessage } from '@utils/types';

// Экшены жизненного цикла WebSocket для пользовательской ленты заказов
// (/orders?token=...). Отдельный набор от feed, чтобы middleware
// различал, какой сокет включать/выключать.

const PREFIX = 'profileOrders';

export const profileOrdersConnect = createAction<string>(`${PREFIX}/connect`);
export const profileOrdersDisconnect = createAction(`${PREFIX}/disconnect`);
export const profileOrdersOnOpen = createAction(`${PREFIX}/onOpen`);
export const profileOrdersOnClose = createAction(`${PREFIX}/onClose`);
export const profileOrdersOnError = createAction<string>(`${PREFIX}/onError`);
export const profileOrdersOnMessage = createAction<OrdersFeedMessage>(
  `${PREFIX}/onMessage`
);
