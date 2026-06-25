import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

// Набор экшенов, через которые middleware взаимодействует со слайсом.
// connect.payload — URL для подключения; onMessage.payload — распарсенный
// JSON-ответ сервера (типизирован дженериком TMessage).
export type WsActions<TMessage> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<TMessage>;
};

const RECONNECT_DELAY_MS = 3000;

// Универсальный generic-генератор Redux-middleware для WebSocket.
// Чек-лист спринта 5: «для сокет-соединения создан универсальный обобщённый
// (generic) генератор middleware и два middleware — по одному для каждой
// из лент заказов».
//
// Применяется так: создаём набор action-creator'ов для конкретной фичи
// (см. feed/actions.ts, profile-orders/actions.ts), оборачиваем
// этой функцией и подключаем в configureStore.middleware.
export const createSocketMiddleware = <TMessage>(
  actions: WsActions<TMessage>
): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let lastUrl: string | null = null;

    const cancelReconnect = (): void => {
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    return (next) => (action) => {
      const { dispatch } = store;

      if (actions.connect.match(action)) {
        // Если уже есть сокет — гасим его перед открытием нового.
        // Старый сокет, когда дойдёт до onclose, увидит socket !== currentSocket
        // и не будет реконнектиться (см. ниже).
        if (socket) {
          socket.close();
          socket = null;
        }
        cancelReconnect();

        const url = action.payload;
        lastUrl = url;

        const currentSocket = new WebSocket(url);
        socket = currentSocket;

        currentSocket.onopen = (): void => {
          dispatch(actions.onOpen());
        };

        currentSocket.onerror = (): void => {
          dispatch(actions.onError('Ошибка WebSocket-соединения'));
        };

        currentSocket.onmessage = (event: MessageEvent<string>): void => {
          try {
            const parsed = JSON.parse(event.data) as TMessage;
            dispatch(actions.onMessage(parsed));
          } catch {
            dispatch(actions.onError('Не удалось распарсить сообщение сервера'));
          }
        };

        currentSocket.onclose = (): void => {
          dispatch(actions.onClose());
          // Реконнект только если этот сокет всё ещё активный (его не заменили
          // новым и не сделали disconnect) и URL сохранён.
          // Опциональный пункт чек-листа: «обработка разрыва сокет-соединения».
          if (socket === currentSocket && lastUrl !== null) {
            reconnectTimer = setTimeout(() => {
              dispatch(actions.connect(lastUrl as string));
            }, RECONNECT_DELAY_MS);
          }
        };
      }

      if (actions.disconnect.match(action)) {
        lastUrl = null;
        cancelReconnect();
        if (socket) {
          socket.close();
          socket = null;
        }
      }

      return next(action);
    };
  };
};
