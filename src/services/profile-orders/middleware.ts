import { createSocketMiddleware } from '../websocket-middleware';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOnClose,
  profileOrdersOnError,
  profileOrdersOnMessage,
  profileOrdersOnOpen,
} from './actions';

import type { OrdersFeedMessage } from '@utils/types';

// Инстанс WebSocket-middleware для пользовательской ленты (/orders?token=).
// Логика обновления токена при ошибке Invalid or missing token живёт
// на стороне страницы ProfileOrders (она ловит selectProfileOrdersError
// и делает refresh + reconnect).
export const profileOrdersSocketMiddleware = createSocketMiddleware<OrdersFeedMessage>({
  connect: profileOrdersConnect,
  disconnect: profileOrdersDisconnect,
  onOpen: profileOrdersOnOpen,
  onClose: profileOrdersOnClose,
  onError: profileOrdersOnError,
  onMessage: profileOrdersOnMessage,
});
