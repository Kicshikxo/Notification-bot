export default {
	target: 'server',
	components: true,

	head: {
		title: 'Vichuxa notifications',
		htmlAttrs: {
			lang: 'ru'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'full-screen', content: 'yes' },
			{ name: 'viewport', content: 'width = device-width, initial-scale = 1, maximum-scale = 1, minimum-scale = 1, user-scalable = no, minimal-ui, shrink-to-fit=no' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
	},

	css: ['@/assets/css/bootstrap.5.0.2.min.css', '@/assets/css/base.css'],

	plugins: [
		{ src: '~/plugins/api.server.js', mode: 'server' },
		{ src: '~/plugins/api.client.js', mode: 'client' }
	],

	modules: [
		'@nuxt/http',
		'vue-sweetalert2/nuxt',
		[
			'vue-toastification/nuxt',
			{
				icon: false,
				position: 'bottom-right',
				transition: 'Vue-Toastification__fade',
				closeButton: false,
				draggablePercent: 0.35,
				transitionDuration: 500,
				maxToasts: 10,
				timeout: 1500,
				newestOnTop: false
			}
		]
	],

	pwa: {
		manifest: {
			name: 'Vichuxa notifications',
			lang: 'ru'
		}
	},

	http: {
		baseURL: '/'
	},

	serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],

	buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/pwa'],
	build: {}
}
