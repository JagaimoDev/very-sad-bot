const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdir } = require('fs/promises');
const fs = require('fs');

require('dotenv').config();
const token = process.env.TOKEN;

const clientId = process.env.APPID;
const guildsJSON = JSON.parse(fs.readFileSync('./guilds.json')).guilds;
const guilds = guildsJSON.filter((x) => x.debug == 'no');
const debugguilds = guildsJSON.filter((x) => x.debug == 'yes');

const commands = [];

async function createApplicationCommands(dir) {
  await readdir(dir).then(async (files) => {
    for (const file of files) {
      if (file.endsWith('.js')) {
        const command = require(`${dir}${file}`);
        commands.push(command.data.toJSON());
        console.log(`Found command: ${dir}${file}`);
      } else {
        await createApplicationCommands(`${dir}${file}/`);
      }
    }
  });
}

(async () => {
  await createApplicationCommands('./utilities/commands/');

  const rest = new REST({ version: '9' }).setToken(token);

  for (guild of guilds) {
    try {
      console.log(`Started refreshing application commands for guild ${guild.name}.`);

      await rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands });

      console.log(`Successfully reloaded application commands for guild ${guild.name}.`);
    } catch (error) {
      console.error(error);
    }
  }

  if (debugguilds.length == 0) return;

  console.log('DEBUG GUILDS FOUND');

  const debugcommands = commands.map((x) => ({ ...x, name: '__debug_' + x.name }));
  commands.push(...debugcommands);

  for (guild of debugguilds) {
    try {
      console.log(`Started refreshing application commands for debug guild ${guild.name}.`);

      await rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands });

      console.log(`Successfully reloaded application commands for debug guild ${guild.name}.`);
    } catch (error) {
      console.error(error);
    }
  }
})();
