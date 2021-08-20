module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
	plugins: [],
	// add your custom rules here
	rules: {
		indent: ['error', 'tab'],
		quotes: ['error', 'single', { avoidEscape: true }],
		'max-len': ['error', { code: 200 }],
		'no-console': 'off',
		'no-tabs': 'off',
		'space-before-function-paren': 'off',
		'arrow-parens': 'off',
		'no-floating-decimal': 'off',
		'vue/html-quotes': ['error', 'single', { avoidEscape: true }],
		'newline-per-chained-call': 'off',
		'array-bracket-newline': 'off',
		'no-useless-return': 'off',
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: []
			}
		]
	}
}
