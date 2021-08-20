/* jshint camelcase: false */

export default {
	target: 'server',
	components: true,

	head: {
		title: 'Vichuxa Bot',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'full-screen', content: 'yes' },
			{ name: 'viewport', content: 'width = device-width, initial-scale = 1, maximum-scale = 1, minimum-scale = 1, user-scalable = no, minimal-ui, shrink-to-fit=no' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
			// { rel: 'preload', type: 'font/woff2', href: '/fonts/Minecraft.woff2', as: 'font' }
		]
	},

	css: ['@/assets/css/bootstrap.5.0.2.min.css'],

	env: {
		SOCKET_SERVER_URI: process.env.SOCKET_SERVER_URI || 'http://localhost:3000'
	},

	plugins: [
// 		{
// 			src: '@/plugins/socket',
// 			ssr: false
// 		},
		{ src: '~/plugins/api.server.js', mode: 'server' },
		{ src: '~/plugins/api.client.js', mode: 'client' }
	],

	pwa: {
		icon: false, // disables the icon module
		manifest: {
			name: 'Durak 8-bit',
			lang: 'ru'
		}
	},

	modules: [
		'@nuxt/http',
// 		'vue-sweetalert2/nuxt',
		[
			'vue-toastification/nuxt',
			{
				icon: false,
				position: 'bottom-right',
				transition: 'Vue-Toastification__fade',
				closeButton: false,
				draggablePercent: 0.35,
				toastClassName: 'px-alert',
				bodyClassName: 'px-alert-body',
				transitionDuration: 500,
				maxToasts: 10,
				newestOnTop: false
			}
		]
	],

	http: {
		baseURL: '/'
	},

	serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],

	buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/pwa'],
	build: {}
}
