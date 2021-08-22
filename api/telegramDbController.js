const MONGO_DB_URI = process.env.MONGO_DB_URI || require('./config.json').MONGO_DB_URI
const db = require('monk')(MONGO_DB_URI)
const users = db.get('TelegramUsers')

class TelegramDatabaseController {
	async subscribe(data) {
		try {
			const isUserSubscribed = !!(await users.findOne({ id: data.from.id }))
			if (isUserSubscribed) {
				return { success: false, error: new Error('ALREADY_SUBSCRIBED') }
			} else {
				await users.insert({
					id: data.from.id,
					chatId: data.chat.id,
					subscribeDate: new Date(data.date * 1000).toISOString()
				})
				return { success: true }
			}
		} catch (e) {
			return { success: false, error: e }
		}
	}

	async unsubscribe(data) {
		try {
			const isUserSubscribed = !!(await users.findOne({ id: data.from.id }))
			if (!isUserSubscribed) {
				return { success: false, error: new Error('NOT_SUBSCRIBED') }
			} else {
				await users.remove({ id: data.from.id })
				return { success: true }
			}
		} catch (e) {
			return { success: false, error: e }
		}
	}

	async forceUnsubscribe(id) {
		try {
			await channels.remove({ id })
			return { success: true }
		} catch (e) {
			console.error(e)
			return { success: false, error: e }
		}
	}

	async getUsers() {
		return await users.find({}, { sort: { subscribeDate: -1 } })
	}
}

module.exports = new TelegramDatabaseController()
