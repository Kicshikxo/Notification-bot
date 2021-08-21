const express = require('express')
const app = express()

const telegramDB = require('./telegramDbController')
const discordDB = require('./discordDbController')
const telegramBot = require('./telegramBot')
const discordBot = require('./discordBot')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/dispatch', async (req, res) => {
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
		return res.json({ success: false, error: e })
	}
})

app.get('/users', async (req, res) => res.json({ users: await telegramDB.getUsers() }))

app.get('/channels', async (req, res) => res.json({ channels: await discordDB.getChannels() }))

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
	console.log(message.member.permissions)
	return message.reply(result.success ? 'Вы подписались на рассылку' : result.error.message === 'ALREADY_SUBSCRIBED' ? 'Вы уже подписаны на рассылку' : 'Произошла незивестная ошибка')
})

discordBot.commands.set('/unsubscribe', async message => {
	const result = await discordDB.unsubscribe(message)
	console.log(message.member.permissions)
	return message.reply(result.success ? 'Вы отписались от рассылки' : result.error.message === 'NOT_SUBSCRIBED' ? 'Вы не подписаны на рассылку' : 'Произошла неизвестная ошибка')
})

module.exports = app
