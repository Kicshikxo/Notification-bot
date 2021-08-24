const express = require('express')
const app = express()
const cors = require('cors')

const telegramDB = require('./telegramDbController')
const discordDB = require('./discordDbController')
const telegramBot = require('./telegramBot')
const discordBot = require('./discordBot')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/broadcast', async (req, res) => {
	const { message, discord, telegram } = req.body

	if (!message.trim()) {
		return res.json({ success: false, error: 'MESSAGE_MUST_BE_NOT_EMPTY' })
	} else if (!discord && !telegram) {
		return res.json({ success: false, error: 'NO_NOTIFICATION_TARGETS_SPECIFIED' })
	}

	try {
		if (discord) {
			const discordChannels = await discordDB.getChannels()
			discordChannels.forEach(channel => discordBot.channels.cache.get(channel.channelId).send(message))
		}

		if (telegram) {
			const telegramUsers = await telegramDB.getUsers()
			telegramUsers.forEach(user => telegramBot.sendMessage(user.chatId, message))
		}

		return res.json({ success: true })
	} catch (e) {
		console.error(e)
		return res.json({ success: false, error: e.toString() })
	}
})

app.get('/telegram/users', async (req, res) => {
	try {
		const users = []

		for (const user of await telegramDB.getUsers()) {
			const userInfo = await telegramBot.getChatMember(user.chatId, user.id)
			const userAvatarList = await telegramBot.getUserProfilePhotos(user.id)
			console.log(userAvatarList)
			const userAvatarLink = userAvatarList.photos && await telegramBot.getFileLink(userAvatarList.photos[0][0].file_id)
			users.push({
				id: userInfo.user.id,
				firstName: userInfo.user.first_name,
				lastName: userInfo.user.last_name,
				avatarLink: userAvatarLink,
				subscribeDate: user.subscribeDate
			})
		}

		return res.json({ success: true, users })
	} catch (e) {
		console.error(e)
		return res.json({ success: false, error: e.toString() })
	}
})

app.get('/discord/servers', async (req, res) => {
	try {
		const servers = []

		for (const channel of await discordDB.getChannels()) {
			const guild = await discordBot.guilds.cache.get(channel.guildId)
			if (!guild) {
				await discordDB.forceUnsubscribe(channel.guildId)
			} else {
				servers.push({
					id: guild.id,
					name: guild.name,
					iconLink: guild.iconURL() || `/img/${((guild.id >>> 0) % 3) + 1}.png`,
					subscribeDate: channel.subscribeDate
				})
			}
		}

		return res.json({ success: true, servers })
	} catch (e) {
		console.error(e)
		return res.json({ success: false, error: e.toString() })
	}
})

telegramBot.onText(/\/start/, async message => {
	await telegramBot.sendMessage(message.chat.id, 'Для подписки на рассылку введите /subscribe')
})

telegramBot.onText(/\/subscribe/, async message => {
	const result = await telegramDB.subscribe(message)
	await telegramBot.sendMessage(
		message.chat.id,
		result.success ? 'Вы подписались на рассылку' : result.error.message === 'ALREADY_SUBSCRIBED' ? 'Вы уже подписаны на рассылку' : 'Произошла незивестная ошибка'
	)
})

telegramBot.onText(/\/unsubscribe/, async message => {
	const result = await telegramDB.unsubscribe(message)
	await telegramBot.sendMessage(
		message.chat.id,
		result.success ? 'Вы отписались от рассылки' : result.error.message === 'NOT_SUBSCRIBED' ? 'Вы не подписаны на рассылку' : 'Произошла неизвестная ошибка'
	)
})

discordBot.commands.set('/subscribe', async message => {
	const result = await discordDB.subscribe(message)
	return message.reply(result.success ? 'Вы подписались на рассылку' : result.error.message === 'ALREADY_SUBSCRIBED' ? 'Вы уже подписаны на рассылку' : 'Произошла незивестная ошибка')
})

discordBot.commands.set('/unsubscribe', async message => {
	const result = await discordDB.unsubscribe(message)
	return message.reply(result.success ? 'Вы отписались от рассылки' : result.error.message === 'NOT_SUBSCRIBED' ? 'Вы не подписаны на рассылку' : 'Произошла неизвестная ошибка')
})

module.exports = app
