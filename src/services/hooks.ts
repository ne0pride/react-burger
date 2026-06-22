import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

// Типизированные хуки — обёртки над useDispatch/useSelector с проставленными
// типами стора. Чек-лист: «Хуки useDispatch и useSelector типизированы
// с помощью метода withTypes». Доступно в react-redux >= 9.0.
//
// Используем эти хуки во всех компонентах вместо стандартных,
// чтобы получать корректный AppDispatch (включая возможность диспатчить
// thunks) и автокомплит по RootState в селекторах.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
