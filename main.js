require('dotenv').config();
const fs = require('fs');
const { client } = require('./config');
const config = require('./config');

config.getCommandFiles('./utilities/commands/');

client.once('ready', async () => {
  config.startStatusTracker();
  config.guildsJSON();
  console.log(`${client.user.tag} logged in successfully!`);
  console.log(`Debug mode is ${process.env.DEBUG != 1 ? 'disabled' : 'enabled'}.`);
  client.user.setStatus('dnd');
  client.user.setActivity('depressing music', { type: 'LISTENING' });
});

client.login(process.env.TOKEN);

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;
  if (process.env.DEBUG == 0 && interaction.commandName.split('_')[2] == 'debug') return;
  if (process.env.DEBUG == 1 && interaction.commandName.split('_')[2] != 'debug') return;

  const command = client.commands.get(process.env.DEBUG != 1 ? interaction.commandName : interaction.commandName.split('_')[3]);
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
  if (guilds.guilds.filter((x) => x.id == guild.id).length != 0) return;
  guilds.guilds.push({ id: guild.id, name: guild.name, debug: 'no' });
  fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
});

client.on('guildDelete', (guild) => {
  console.log(`Left guild: ${guild.name}`);
  const guilds = JSON.parse(fs.readFileSync('./guilds.json'));
  guilds.guilds = guilds.guilds.filter((x) => x.id != guild.id);
  fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
});
