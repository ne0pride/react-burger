import { createSocketMiddleware } from '../websocket-middleware';
import {
  feedConnect,
  feedDisconnect,
  feedOnClose,
  feedOnError,
  feedOnMessage,
  feedOnOpen,
} from './actions';

import type { OrdersFeedMessage } from '@utils/types';

// Инстанс WebSocket-middleware для общей ленты заказов (/orders/all).
// Второй инстанс — для пользовательской ленты (/orders?token=...) —
// создаётся в profile-orders/middleware.ts.
export const feedSocketMiddleware = createSocketMiddleware<OrdersFeedMessage>({
  connect: feedConnect,
  disconnect: feedDisconnect,
  onOpen: feedOnOpen,
  onClose: feedOnClose,
  onError: feedOnError,
  onMessage: feedOnMessage,
});
