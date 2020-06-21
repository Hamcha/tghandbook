module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "one-var": "off", // WHO CARES?????
    "no-use-before-define": "off", // YOU ARE WRONG
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-param-reassign": "off",
    "no-alert": "off",
    "no-console": "off",
    "func-names": "off",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
      },
    ],
  },
};
