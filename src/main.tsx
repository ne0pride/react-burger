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
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* basename берём из base Vite (import.meta.env.BASE_URL): в проде это
          /react-burger/ для GitHub Pages, в dev/тестах — /. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
