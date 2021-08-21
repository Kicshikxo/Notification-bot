<template>
	<div>
		<Header button-text='Открыть меню' @click='openNotificationMenu' />
		<div class='container d-flex justify-content-center align-items-center flex-column'>
			<div class='row row-2 w-100'>
				<div v-if='discordChallensList.length' class='col-lg'>
					<div class='container discord-servers-list pt-3 px-3 my-3'>
						<div class='d-flex align-items-center justify-content-between'>
							<h4>
								Подписчики в Discord
							</h4>
							<h5 class='total-items-amount'>
								Всего: {{ discordChallensList.length }}
							</h5>
						</div>
						<div v-for='channel in discordChallensList' :key='channel.id' class='row my-1 pt-1 discord-server'>
							<div class='col-auto d-flex justify-content-end'>
								<img :src='channel.iconLink' draggable='false' alt='icon' class='discord-server-icon'>
							</div>
							<div class='col discord-server-info'>
								<div class='discord-server-name h-50 pt-1'>
									{{ channel.name }}
								</div>
								<div class='discord-server-subscribe-date h-50 d-flex align-items-end pb-2' :title="new Date(channel.subscribeDate).toLocaleString('ru')">
									Отслеживает с {{ getFormatedDate(new Date(channel.subscribeDate)) }}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if='telegramUsersList.length' class='col-lg'>
					<div class='container telegram-users-list pt-3 px-3 my-3'>
						<div class='d-flex align-items-center justify-content-between'>
							<h4>
								Подписчики в Telegram
							</h4>
							<h5 class='total-items-amount'>
								Всего: {{ telegramUsersList.length }}
							</h5>
						</div>
						<div v-for='user in telegramUsersList' :key='user.id' class='row my-1 pt-1 telegram-user'>
							<div class='col-auto d-flex justify-content-end'>
								<img :src='user.avatarLink' draggable='false' alt='avatar' class='telegram-user-avatar'>
							</div>
							<div class='col telegram-user-info'>
								<div class='telegram-user-name h-50 pt-1'>
									{{ user.firstName }} {{ user.lastName }}
								</div>
								<div class='telegram-user-subscribe-date h-50 d-flex align-items-end pb-2' :title="new Date(channel.subscribeDate).toLocaleString('ru')">
									Отслеживает с {{ getFormatedDate(new Date(user.subscribeDate)) }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	layout: 'withoutHeader',
	async asyncData({ $api }) {
		const { users: telegramUsersList } = await $api('users')
		const { channels: discordChallensList } = await $api('channels')
		return { telegramUsersList, discordChallensList }
	},
	methods: {
		openNotificationMenu() {
			this.$swal({
				input: 'textarea',
				title: 'Отправить оповещение',
				inputPlaceholder: 'Введите текст...',
				confirmButtonColor: '#0D6EFD',
				confirmButtonText: 'Отправить',
				showLoaderOnConfirm: true,
				html: `
					<div class='input-group d-flex justify-content-center px-2'>
						<label class='input-group-text w-50 d-flex flex-column bg-transparent'>
							<img class='discord-image m-2'>
							<div class='form-check form-switch'>
								<input id='discord-checkbox' class='form-check-input' type='checkbox' checked>
							</div>
						</label>
						<label class='input-group-text w-50 d-flex flex-column bg-transparent'>
							<img class='telegram-image m-2'>
							<div class='form-check form-switch'>
								<input id='telegram-checkbox' class='form-check-input' type='checkbox' checked>
							</div>
						</label>
					</div>
				`,
				inputValidator: value => {
					const discord = document.querySelector('#discord-checkbox').checked
					const telegram = document.querySelector('#telegram-checkbox').checked

					if (!discord && !telegram) {
						return 'Не указана цель оповещения'
					} else if (!value.trim()) {
						return 'Текст оповещения не может быть пустым'
					}
				},
				allowOutsideClick: () => !this.$swal.isLoading(),
				preConfirm: async message => {
					const discord = document.querySelector('#discord-checkbox').checked
					const telegram = document.querySelector('#telegram-checkbox').checked

					if (message && (discord || telegram)) {
						const result = await this.$api('broadcast', { message, discord, telegram })
						if (result.success) {
							this.$toast('Отправлено', { type: 'success' })
						} else {
							this.$toast('Ошибка отправки', { type: 'error' })
							console.error(result.error)
						}
						return result.success
					}
				}
			})
		},
		getFormatedDate(date) {
			return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
		}
	}
}
</script>
<style scoped>
.telegram-users-list,
.discord-servers-list {
	border: 1px solid #d9d9d9;
	border-radius: 0.1875em 0 0 0.1875em;
	width: 100%;
	white-space: nowrap;
	overflow: auto;
	max-height: 569px;
}

.telegram-user,
.discord-server {
	border-top: 1px solid #d9d9d9;
}

.telegram-user-avatar,
.discord-server-icon {
	width: 64px;
	height: 64px;
	border-radius: 50%;
}
.telegram-user-info,
.discord-server-info {
	overflow: hidden;
	text-overflow: ellipsis;
}

.telegram-user-name,
.discord-server-name {
	font-weight: bold;
	font-size: 16px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.telegram-user-subscribe-date,
.discord-server-subscribe-date {
	color: #555;
	font-size: 14px;
}

@media (max-width: 430px) {
	.total-items-amount {
		display: none;
	}
	.header {
		flex-direction: column;
		padding-bottom: 0.5rem !important;
	}
}

@media (max-width: 991px) {
	.telegram-users-list,
	.discord-servers-list {
		max-height: 420px;
	}
}
</style>
