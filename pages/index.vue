<template>
	<div>
		<Header :danger-button-text="hasLastMessages ? 'Меню удаления' : null" primary-button-text='Меню оповещений' @danger-button-click='openDeleteMenu' @primary-button-click='openNotificationMenu' />
		<div class='container d-flex justify-content-center align-items-center flex-column'>
			<div class='row row-2 w-100'>
				<div v-if='discordServersList.length' class='col-lg'>
					<div class='container discord-servers-list pt-3 px-3 my-3'>
						<div class='d-flex align-items-center justify-content-between'>
							<h4>
								Серверы в Discord
							</h4>
							<h5 class='total-items-amount'>
								Всего: {{ discordServersList.length }}
							</h5>
						</div>

						<div v-for='server in discordServersList' :key='server.id' class='row my-1 pt-1 discord-server'>
							<div class='col-auto d-flex justify-content-end'>
								<img :src='server.iconLink' draggable='false' alt='icon' class='discord-server-icon'>
							</div>
							<div class='col discord-server-info px-0'>
								<div class='discord-server-name h-50 pt-1'>
									{{ server.name }}
								</div>
								<div class='discord-server-subscribe-date h-50 d-flex align-items-end pb-2'>
									Отслеживает с&nbsp;
									<span :title="new Date(server.subscribeDate).toLocaleString('ru', { timeZone: 'Europe/Moscow' })">{{ getFormatedDate(new Date(server.subscribeDate)) }}</span>
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
							<div class='col telegram-user-info px-0'>
								<div class='telegram-user-name h-50 pt-1'>
									{{ user.firstName }} {{ user.lastName }}
								</div>
								<div class='telegram-user-subscribe-date h-50 d-flex align-items-end pb-2'>
									Отслеживает с&nbsp;
									<span :title="new Date(user.subscribeDate).toLocaleString('ru', { timeZone: 'Europe/Moscow' })">{{ getFormatedDate(new Date(user.subscribeDate)) }}</span>
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
		const telegramData = await $api('telegram/users')
		const discordData = await $api('discord/servers')

		if (!telegramData.success) {
			console.error(telegramData.error)
		} else if (!discordData.success) {
			console.error(discordData.error)
		}

		const telegramUsersList = telegramData.users || []
		const discordServersList = discordData.servers || []

		return { hasLastMessages: telegramData.hasLastMessages || discordData.hasLastMessages, telegramUsersList, discordServersList }
	},
	data: () => ({
		savedDiscordText: '',
		savedTelegramText: ''
	}),
	mounted() {
		this.savedDiscordText = localStorage.getItem('discordText') || ''
		this.savedTelegramText = localStorage.getItem('telegramText') || ''
	},
	methods: {
		openDeleteMenu() {
			this.$swal({
				title: 'Удалить последнее сообщение',
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
				confirmButtonColor: '#dc3545',
				confirmButtonText: 'Удалить',
				showLoaderOnConfirm: true,
				allowOutsideClick: () => !this.$swal.isLoading(),
				preConfirm: async () => {
					const discord = document.querySelector('#discord-checkbox').checked
					const telegram = document.querySelector('#telegram-checkbox').checked

					if (discord || telegram) {
						const result = await this.$api('deleteLastMessages', { discord, telegram })
						if (result.success) {
							this.$toast('Последнее сообщение удалено', { type: 'success' })
							this.hasLastMessages = result.hasLastMessages
						} else {
							this.$toast('Ошибка удаления последнего сообщения', { type: 'error' })
							console.error(result.error)
						}
						return result.success
					} else {
						return false
					}
				}
			})
		},
		openNotificationMenu() {
			this.$swal({
				title: 'Отправить оповещение',
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
					<div class='input-group px-2 pb-2 mt-3'>
						<textarea id='discord-text'  class='form-control pb-3' placeholder='Текст для discord...'>${this.savedDiscordText}</textarea>
						<textarea id='telegram-text' class='form-control pb-3' placeholder='Текст для telegram...'>${this.savedTelegramText}</textarea>
					</div>
				`,
				input: 'textarea',
				confirmButtonColor: '#0D6EFD',
				confirmButtonText: 'Отправить',
				showLoaderOnConfirm: true,
				inputValidator: () => {
					const discord = document.querySelector('#discord-checkbox').checked
					const telegram = document.querySelector('#telegram-checkbox').checked
					const discordText = document.querySelector('#discord-text').value
					const telegramText = document.querySelector('#telegram-text').value

					if (!discord && !telegram) {
						return 'Не указана ни одна цель оповещения'
					} else if (!discordText && !telegramText) {
						return 'Не указан ни один текст оповещения'
					} else if (discord && !discordText) {
						return 'Не указан текст для discord'
					} else if (telegram && !telegramText) {
						return 'Не указан текст для telegram'
					}
				},
				allowOutsideClick: () => !this.$swal.isLoading(),
				preConfirm: async message => {
					const discord = document.querySelector('#discord-checkbox').checked
					const telegram = document.querySelector('#telegram-checkbox').checked
					const discordText = document.querySelector('#discord-text').value
					const telegramText = document.querySelector('#telegram-text').value

					if ((discord && discordText) || (telegram && telegramText)) {
						const result = await this.$api('broadcast', { messages: { discord: discordText, telegram: telegramText }, discord, telegram })
						if (result.success) {
							this.$toast('Отправлено', { type: 'success' })
							this.hasLastMessages = true
							if (discord) {
								this.savedDiscordText = discordText
								localStorage.setItem('discordText', discordText)
							}
							if (telegram) {
								this.savedTelegramText = telegramText
								localStorage.setItem('telegramText', telegramText)
							}
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
	overflow-x: hidden;
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
		max-height: 421px;
	}
}
</style>
