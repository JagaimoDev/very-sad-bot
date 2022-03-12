const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'ping',
  data: new SlashCommandBuilder().setName('ping').setDescription('pong'),
	exec: (interaction) => {
		interaction.reply(':ping_pong:');
	},
};
