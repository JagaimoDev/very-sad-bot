require('dotenv').config();
const fs = require('fs');
const { client } = require('./config');
const config = require('./config');

config.getCommandFiles('./utilities/commands/');
config.startStatusTracker();

client.once('ready', async () => {
  console.log(`${client.user.tag} logged in successfully!`);
  config.guildsJSON();
  client.user.setStatus('dnd');
  //client.user.setActivity('depressing music', {type: 'LISTENING'});
});

client.login(process.env.TOKEN);

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  try {
    command.exec(interaction);
    console.log(`USER '${interaction.user.tag}' EXECUTED '${interaction.commandName}' COMMAND IN GUILD '${interaction.guild.name}' ON CHANNEL '${interaction.channel.name}'`);
  } catch (e) {
    console.error(e);
    interaction.reply({ content: 'An error occured while executing the command :c', ephemeral: true });
  }
});

client.on('guildCreate', (guild) => {
	console.log(`Joined guild: ${guild.name}`);
  const guilds = JSON.parse(fs.readFileSync('./guilds.json'));
  if (guilds.guilds.filter(x => x.id == guild.id).length != 0) return;
  guilds.guilds.push({ name: guild.name, id: guild.id });
  fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
});

client.on('guildDelete', (guild) => {
	console.log(`Left guild: ${guild.name}`);
  const guilds = JSON.parse(fs.readFileSync('./guilds.json'));
  guilds.guilds = guilds.guilds.filter(x => x.id != guild.id);
  fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
});
