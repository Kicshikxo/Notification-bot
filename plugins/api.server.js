export default ({ $http, req }, inject) => {
	inject('api', async path => {
		try {
			return await $http.$get(`http://${req.headers.host}/api/${path}`)
		} catch (e) {
			console.error(e)
			return { success: false, error: e }
		}
	})
}
