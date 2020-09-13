module.exports = {
  extends: [
    "react-app",
    "plugin:flowtype/recommended",
    "prettier",
    "prettier/babel",
  ],
  rules: {
    "jsx-a11y/anchor-is-valid": 0,
    "no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
      },
    ],
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
