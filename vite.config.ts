import react from '@vitejs/plugin-react';
// import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    // checker({
    //   typescript: true,
    // }),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  // При сборке для GitHub Pages приложение раздаётся из подпути
  // /react-burger/, поэтому нужен соответствующий base. В dev и тестах — '/'.
  base: command === 'build' ? '/react-burger/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
  server: {
    open: true,
  },
}));
