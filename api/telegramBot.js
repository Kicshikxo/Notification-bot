const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY || require('./config.json').TELEGRAM_API_KEY

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
		command: '/subscribe',
		description: 'Подписаться на рассылку'
	},
	{
		command: '/unsubscribe',
		description: 'Отписаться от рассылки'
	}
])

module.exports = bot
