import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "coverage", "prisma/migrations"] },
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      // NestJS DI and class-validator rely on decorator metadata and
      // parameter properties that these rules misread.
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Prisma mocks in tests are deliberately loose; `any` stays banned in src.
    files: ["**/__tests__/**/*.ts", "test/**/*.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);
