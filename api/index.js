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

	if (!message.trim() || (!discord && !telegram)) {
		return res.json({ success: false })
	}

	if (discord) {
		const discordChannels = await discordDB.getChannels()
		discordChannels.forEach(channel => discordBot.channels.cache.get(channel.channelId).send(message))
	}

	if (telegram) {
		const telegramUsers = await telegramDB.getUsers()
		telegramUsers.forEach(user => telegramBot.sendMessage(user.chatId, message))
	}

	res.json({ success: true })
})

telegramBot.onText(/\/start/, async message => {
	await telegramBot.sendMessage(message.chat.id, 'Для подписки на рассылку введите /subscribe')
})

telegramBot.onText(/\/subscribe/, async message => {
	const result = await telegramDB.subscribe(message)
	await telegramBot.sendMessage(message.chat.id, result.success ? 'Вы подписались на рассылку' : 'Вы уже подписаны на рассылку')
})

telegramBot.onText(/\/unsubscribe/, async message => {
	const result = await telegramDB.unsubscribe(message)
	await telegramBot.sendMessage(message.chat.id, result.success ? 'Вы отписались от рассылки' : 'Вы не подписаны на рассылку')
})

discordBot.commands.set('/subscribe', async message => {
	const result = await discordDB.subscribe(message)
	return message.reply(result.success ? 'Вы подписались на рассылку' : 'Вы уже подписаны на рассылку')
})

discordBot.commands.set('/unsubscribe', async message => {
	const result = await discordDB.unsubscribe(message)
	return message.reply(result.success ? 'Вы отписались от рассылки' : 'Вы не подписаны на рассылку')
})

module.exports = app

if (require.main === module) {
	const port = process.env.PORT || 3001
	app.listen(port, () => {
		console.log(`API server listening on port ${port}`)
	})
}
