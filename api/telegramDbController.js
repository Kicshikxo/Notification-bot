const MONGO_DB_URI = process.env.MONGO_DB_URI || require('./config.json').MONGO_DB_URI
const db = require('monk')(MONGO_DB_URI)
const users = db.get('TelegramUsers')

class DatabaseController {
	async subscribe(data) {
		const isUserSubscribed = !!(await users.findOne({ id: data.from.id }))
		if (isUserSubscribed) {
			return { success: false }
		} else {
			users.insert({
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
			return { success: false }
		} else {
			users.remove({ id: data.from.id })
			return { success: true }
		}
	}

	async getUsers() {
		return await users.find()
	}
}

module.exports = new DatabaseController()
