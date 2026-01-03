
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { globalIgnores } from 'eslint/config';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
})

/** @type {import("eslint").Linter.Config} */
export default [
    ...compat.extends('eslint:recommended'),
    ...compat.extends('plugin:import/recommended'),
    ...compat.extends('@networking/eslint-config/library.js'),
    ...compat.extends('prettier'),
    {
        rules: {
            'no-unused-vars': 'off',
        },
    }, globalIgnores([
        '.*.js',
        'node_modules/',
        'dist/',
        '/public/**',
    ],)]
