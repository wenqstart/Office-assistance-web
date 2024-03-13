import { defineConfig } from 'umi'
import theme from './theme.orange'
export default defineConfig({
  theme,
  scripts: ['localStorage.setItem("theme", "orange");'],
})
