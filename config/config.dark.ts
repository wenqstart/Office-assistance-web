import { defineConfig } from '@umijs/max'
import theme from './theme.dark'

export default defineConfig({
  theme,
  scripts: ['localStorage.setItem("theme", "dark");'],
})
