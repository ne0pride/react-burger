import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from '@components/app/app';
import { store } from '@services/store';

import './index.css';

// DndProvider — обязательная обёртка react-dnd. backend описывает,
// как именно отслеживать перетаскивания. HTML5Backend использует
// нативные drag-события браузера и работает для всех десктопных браузеров.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </StrictMode>
);
