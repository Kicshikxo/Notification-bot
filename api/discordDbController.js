const MONGO_DB_URI = process.env.MONGO_DB_URI || require('./config.json').MONGO_DB_URI
const db = require('monk')(MONGO_DB_URI)
const channels = db.get('DiscordChannels')

class DiscordDatabaseController {
	async subscribe(data) {
		try {
			const isChannelSubscribed = !!(await channels.findOne({ guildId: data.guildId }))
			if (isChannelSubscribed) {
				return { success: false, error: new Error('ALREADY_SUBSCRIBED') }
			} else {
				await channels.insert({
					channelId: data.channelId,
					guildId: data.guildId,
					subscribeDate: new Date(data.createdTimestamp).toISOString()
				})
				return { success: true }
			}
		} catch (e) {
			return { success: false, error: e }
		}
	}

	async unsubscribe(data) {
		try {
			const isChannelSubscribed = !!(await channels.findOne({ guildId: data.guildId }))
			if (!isChannelSubscribed) {
				return { success: false, error: new Error('NOT_SUBSCRIBED') }
			} else {
				await channels.remove({ guildId: data.guildId })
				return { success: true }
			}
		} catch (e) {
			return { success: false, error: e }
		}
	}

	async forceUnsubscribe(guildId) {
		try {
			await channels.remove({ guildId })
			return { success: true }
		} catch (e) {
			console.error(e)
			return { success: false, error: e }
		}
	}

	async getChannels() {
		return await channels.find({}, { sort: { subscribeDate: -1 } })
	}
}

module.exports = new DiscordDatabaseController()
