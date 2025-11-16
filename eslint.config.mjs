import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['public/js/bootJs/**'],
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node }
  },
  { ignores: ['public/js/bootJs/**'], files: ['**/*.js'], languageOptions: { sourceType: 'commonjs', globals: globals.node } }
])
