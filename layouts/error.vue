<template>
	<section class='container'>
		<div>
			<h1 class='title'>
				{{ error.statusCode }}
			</h1>
			<h2 class='info'>
				{{ error.message }}
			</h2>
			<nuxt-link v-if='error.statusCode === 404' class='mt-5' to='/'>
				На главную
			</nuxt-link>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		error: {
			type: Object,
			default: () => ({})
		}
	}
}
</script>

<style scoped>
.container {
	margin: 0 auto;
	width: 100vw;
	min-height: 80vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.title {
	font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	display: block;
	font-weight: 300;
	font-size: 100px;
	color: #35495e;
	letter-spacing: 1px;
}
.info {
	font-weight: 300;
	color: #9aabb1;
	margin: 0;
}
</style>
