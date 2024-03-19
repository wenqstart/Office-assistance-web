import { defineConfig } from '@umijs/max'
import theme from './theme.orange'
export default defineConfig({
  theme,
  scripts: ['localStorage.setItem("theme", "orange");'],
})
