module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
