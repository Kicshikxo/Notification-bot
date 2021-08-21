const MONGO_DB_URI = process.env.MONGO_DB_URI || require('./config.json').MONGO_DB_URI
const db = require('monk')(MONGO_DB_URI)
const users = db.get('TelegramUsers')

class TelegramDatabaseController {
	async subscribe(data) {
		const isUserSubscribed = !!(await users.findOne({ id: data.from.id }))
		if (isUserSubscribed) {
			return { success: false, error: new Error('Already subscribed') }
		} else {
			await users.insert({
				id: data.from.id,
				chatId: data.chat.id,
				subscribeDate: new Date(data.date * 1000).toISOString()
			})
			return { success: true }
		}
	}

	async unsubscribe(data) {
		const isUserSubscribed = !!(await users.findOne({ id: data.from.id }))
		if (!isUserSubscribed) {
			return { success: false, error: new Error('Not subscribed') }
		} else {
			await users.remove({ id: data.from.id })
			return { success: true }
		}
	}

	async getUsers() {
		return await users.find()
	}
}

module.exports = new TelegramDatabaseController()
