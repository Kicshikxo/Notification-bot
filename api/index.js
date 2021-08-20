const express = require('express')
const app = express()

app.get('/test', (req, res) => {
	res.json({
		success: true
	})
})

const axios = require('axios')
const iconv = require('iconv-lite')

const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY || require('./config.json').TELEGRAM_API_KEY

const getJoke = async type => {
	const response = await axios.get(`http://rzhunemogu.ru/RandJSON.aspx?CType=${type}`, {
		responseType: 'arraybuffer',
		responseEncoding: 'binary'
	})
	const content = iconv.decode(Buffer.from(response.data), 'windows-1251').slice(12, -2)
	return content
}

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(TELEGRAM_API_KEY, {
	polling: true
})

bot.setMyCommands([
	{
		command: '/start',
		description: 'Стартовая команда'
	},
	{
		command: '/anek',
		description: 'Получить анекдот'
	}
])

bot.onText(/\/start/, async message => {
	await bot.sendMessage(message.chat.id, 'Напиши /anek чтобы получить анекдот')
})

bot.onText(/\/anek/, async message => {
	await bot.sendMessage(message.chat.id, await getJoke(1))
})

module.exports = app

if (require.main === module) {
	const port = process.env.PORT || 3001
	app.listen(port, () => {
		console.log(`API server listening on port ${port}`)
	})
}
