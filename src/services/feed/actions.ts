import { createAction } from '@reduxjs/toolkit';

import type { OrdersFeedMessage } from '@utils/types';

// Экшены жизненного цикла WebSocket для ленты заказов /orders/all.
// Их слушает feedSocketMiddleware (см. ./middleware.ts) и feedSlice.
//
// connect.payload — URL для подключения; onMessage.payload — распарсенный
// снапшот заказов от сервера.

const PREFIX = 'feed';

export const feedConnect = createAction<string>(`${PREFIX}/connect`);
export const feedDisconnect = createAction(`${PREFIX}/disconnect`);
export const feedOnOpen = createAction(`${PREFIX}/onOpen`);
export const feedOnClose = createAction(`${PREFIX}/onClose`);
export const feedOnError = createAction<string>(`${PREFIX}/onError`);
export const feedOnMessage = createAction<OrdersFeedMessage>(`${PREFIX}/onMessage`);
