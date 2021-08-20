export default ({ $http, req }, inject) => {
	inject('api', async path => {
		try {
			// const api = require('../api/index')
			// console.log(api.connect('/time'))
			return await $http.$get(`http://${req.headers.host}/api/${path}`)
		} catch (e) {
			console.error(e)
			return { success: false }
		}
	})
}
