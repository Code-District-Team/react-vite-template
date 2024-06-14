module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-var": "error",
    "no-debugger": "warn",
    "no-dupe-keys": "error",
    "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "no-console": "warn",
    "no-duplicate-imports": "error",
    "no-prototype-builtins": "warn",
    "array-callback-return": "error",
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off", // * Disable prop-types
  },
};

// eslint rules guide
// https://eslint.org/docs/latest/rules/
