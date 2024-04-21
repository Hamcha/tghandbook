import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "one-var": "off", // WHO CARES?????
      "no-use-before-define": "off", // YOU ARE WRONG
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "no-param-reassign": "off",
      "no-alert": "off",
      "no-console": "off",
      "no-shadow": "off",
      "func-names": "off",
      "default-param-last": "off",
      "dot-notation": ["error", { allowPattern: "^[A-Z][a-z]+$" }]
    }
  }
];