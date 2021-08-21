<template>
	<div class='header d-flex flex-md-row justify-content-between align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm'>
		<h3 class='my-0 mr-md-auto'>
			Панель уведомлений
		</h3>
		<nav class='my-2 my-md-0 mr-md-3'>
			<button v-if='buttonText' class='btn btn-primary mt-1' @click="$emit('click')">
				{{ buttonText }}
			</button>
		</nav>
	</div>
</template>
<script>
export default {
	props: {
		buttonText: {
			type: String,
			required: false,
			default: ''
		}
	}
}
</script>
