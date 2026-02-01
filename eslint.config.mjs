import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  // Carga la configuración recomendada para Next.js y TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    // Reglas personalizadas (tus reglas de siempre)
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Ignorar carpetas pesadas (reemplaza al .eslintignore)
  {
    ignores: ['.next/', 'node_modules/', 'public/', 'out/'],
  },
]

export default eslintConfig
