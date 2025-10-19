import js from "@eslint/js";
import globals from "globals";

export default [
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.webextensions
			}
		},
		rules: {
			...js.configs.recommended.rules,
			"indent": ["error", "tab"],
			"quotes": ["error", "double"],
			"semi": ["error", "always"]
		}
	}
];
