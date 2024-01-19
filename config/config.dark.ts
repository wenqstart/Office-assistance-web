import { defineConfig } from 'umi';
import theme from './theme.dark.ts';
export default defineConfig({
  theme,
  scripts: ['localStorage.setItem("theme", "dark");'],
});
