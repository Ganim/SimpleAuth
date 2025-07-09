import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }},
  globalIgnores(["build/**/*"], "Ignore Build Directory"),
  globalIgnores(["node_modules/*"], "Ignore Node Modules Directory"),
  tseslint.configs.recommended,
  eslintConfigPrettier
]);
