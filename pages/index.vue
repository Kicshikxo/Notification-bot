<template>
	<div class='container d-flex justify-content-center'>
		<div>
			<Logo />
			<div class='mt-5'>
				{{ test }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	async asyncData({ $api }) {
		const test = await $api('test')
		return {
			test
		}
	}
}
</script>

<style scoped></style>
