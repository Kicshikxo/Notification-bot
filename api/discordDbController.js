const MONGO_DB_URI = process.env.MONGO_DB_URI || require('./config.json').MONGO_DB_URI
const db = require('monk')(MONGO_DB_URI)
const channels = db.get('DiscordChannels')

class DiscordDatabaseController {
	async subscribe(data) {
		const isChannelSubscribed = !!(await channels.findOne({ guildId: data.guildId }))
		if (isChannelSubscribed) {
			return { success: false }
		} else {
			await channels.insert({
				channelId: data.channelId,
				guildId: data.guildId,
				subscribeDate: new Date(data.createdTimestamp).toISOString()
			})
			return { success: true }
		}
	}

	async unsubscribe(data) {
		const isChannelSubscribed = !!(await channels.findOne({ guildId: data.guildId }))
		if (!isChannelSubscribed) {
			return { success: false }
		} else {
			await channels.remove({ guildId: data.guildId })
			return { success: true }
		}
	}

	async getChannels() {
		return await channels.find()
	}
}

module.exports = new DiscordDatabaseController()
