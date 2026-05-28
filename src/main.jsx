import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@components/app/app';
import { store } from '@services/store';

import './index.css';

// Порядок обёрток:
// BrowserRouter снаружи всех — управление URL должно быть доступно
// и Redux-стору (для thunks), и компонентам.
// Provider тоже снаружи — DndProvider в Home может вызывать useDispatch.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
