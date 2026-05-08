import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      // Error — langsung gagal pipeline
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-console": "off",

      // Style
      "semi": ["warn", "always"],
      "quotes": ["warn", "double"]
    }
  }
];
