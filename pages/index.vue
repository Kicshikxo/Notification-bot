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
								<img :src='channel.iconLink' alt='icon' class='discord-server-icon'>
							</div>
							<div class='col discord-server-info'>
								<div class='discord-server-name h-50 pt-1'>
									{{ channel.name }}
								</div>
								<div class='discord-server-subscribe-date h-50 d-flex align-items-end pb-2'>
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
								<img :src='user.avatarLink' alt='avatar' class='telegram-user-avatar'>
							</div>
							<div class='col telegram-user-info'>
								<div class='telegram-user-name h-50 pt-1'>
									{{ user.first_name }} {{ user.last_name }}
								</div>
								<div class='telegram-user-subscribe-date h-50 d-flex align-items-end pb-2'>
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
				inputPlaceholder: 'Введите текст оповещения...',
				confirmButtonColor: '#0D6EFD',
				confirmButtonText: 'Отправить',
				showLoaderOnConfirm: true,
				html: `
					<div class='input-group d-flex justify-content-center'>
						<label class='input-group-text d-flex flex-column bg-transparent'>
							<svg
								enable-background='new 0 0 157.728 157.731'
								width='40'
								height='40'
								viewBox='0 0 157.728 157.731'
								xml:space='preserve'
								xmlns='http://www.w3.org/2000/svg'
								class='m-2'
							>
								<g>
									<path
										d='M78.864,0c43.556,0,78.863,35.308,78.863,78.864c0,43.552-35.308,78.868-78.863,78.868
												C35.308,157.731,0,122.416,0,78.864C0,35.308,35.308,0,78.864,0z'
										fill='#5865F2'
									/>
									<path
										d='M113.101,53.34c0,0-9.76-7.635-21.284-8.514l-1.043,2.076c10.425,2.552,15.2,6.207,20.199,10.695
												c-8.612-4.394-17.112-8.514-31.927-8.514c-14.815,0-23.322,4.12-31.926,8.514c4.985-4.488,10.677-8.545,20.192-10.695l-1.036-2.076
												c-12.099,1.145-21.284,8.514-21.284,8.514S34.09,69.143,32.221,100.166c10.985,12.672,27.669,12.771,27.669,12.771l3.487-4.649
												c-5.923-2.059-12.61-5.741-18.386-12.378c6.889,5.209,17.293,10.642,34.055,10.642c16.762,0,27.158-5.426,34.055-10.642
												c-5.783,6.637-12.47,10.319-18.386,12.378l3.487,4.649c0,0,16.677-0.099,27.669-12.771C123.995,69.143,113.101,53.34,113.101,53.34
												z M65.211,91.651c-4.117,0-7.449-3.809-7.449-8.514c0-4.701,3.333-8.513,7.449-8.513c4.117,0,7.45,3.812,7.45,8.513
												C72.661,87.843,69.328,91.651,65.211,91.651z M92.881,91.651c-4.117,0-7.45-3.809-7.45-8.514c0-4.701,3.333-8.513,7.45-8.513
												c4.116,0,7.449,3.812,7.449,8.513C100.33,87.843,96.99,91.651,92.881,91.651z'
										fill='#FFFFFF'
									/>
								</g>
							</svg>
							<input id='discord-checkbox' class='form-check-input' type='checkbox' checked>
						</label>
						<label class='input-group-text d-flex flex-column bg-transparent'>
							<svg
								enable-background='new 0 0 24 24'
								width='40'
								height='40'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
								class='m-2'
							>
								<circle cx='12' cy='12' fill='#2A9ED6' r='12' />
								<path
									d='m5.491 11.74 11.57-4.461c.537-.194 1.006.131.832.943l.001-.001-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447
												1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z'
									fill='#FFFFFF'
								/>
							</svg>
							<input id='telegram-checkbox' class='form-check-input' type='checkbox' checked>
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
	overflow-y: none;
	max-height: 580px;
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
}

@media (max-width: 991px) {
	.telegram-users-list,
	.discord-servers-list {
		max-height: 435px;
	}
}
</style>
