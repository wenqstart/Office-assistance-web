import { defineConfig } from 'umi';
import theme from './theme.orange.ts';
export default defineConfig({
  theme,
  scripts: ['localStorage.setItem("theme", "orange");'],
});
