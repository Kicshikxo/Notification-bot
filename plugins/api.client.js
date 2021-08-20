export default ({ $http }, inject) => {
	inject('api', async (path, params) => {
		try {
			return await $http['$' + (params ? 'post' : 'get')](`/api/${path}`, params)
		} catch (e) {
			console.error(e)
			return { success: false, error: e }
		}
	})
}
