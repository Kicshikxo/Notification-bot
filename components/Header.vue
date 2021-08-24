<template>
	<div class='header d-flex flex-md-row justify-content-between align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm'>
		<h3 class='my-0 mr-md-auto'>
			Панель уведомлений
		</h3>
		<nav class='my-md-0 mr-md-3'>
			<button v-if='dangerButtonText' class='btn btn-danger mt-1' @click="$emit('danger-button-click')">
				{{ dangerButtonText }}
			</button>
			<button v-if='primaryButtonText' class='btn btn-primary mt-1' @click="$emit('primary-button-click')">
				{{ primaryButtonText }}
			</button>
		</nav>
	</div>
</template>
<script>
export default {
	props: {
		dangerButtonText: {
			type: String,
			required: false,
			default: ''
		},
		primaryButtonText: {
			type: String,
			required: false,
			default: ''
		}
	},
	emits: ['danger-button-click', 'primary-button-click']
}
</script>
