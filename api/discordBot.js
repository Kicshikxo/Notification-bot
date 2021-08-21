const DISCORD_API_KEY = process.env.DISCORD_API_KEY || require('./config.json').DISCORD_API_KEY
const { Client, Collection, Intents } = require('discord.js')

const intents = new Intents(32767)
const client = new Client({ intents })
client.commands = new Collection()

client.on('messageCreate', message => {
	if (!message.content.startsWith('/') || message.author.bot || message.member.permissions.has('ADMINISTRATOR')) {
		return
	}
	// console.log(message)
	const args = message.content.split(/ +/)
	const command = client.commands.get(args[0])
	if (command) {
		command(message)
	}
})

client.login(DISCORD_API_KEY)

module.exports = client
