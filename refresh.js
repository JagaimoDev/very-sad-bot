const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdir } = require('fs/promises');
const fs = require('fs');

require('dotenv').config();
const token = process.env.TOKEN;

const clientId = process.env.APPID;
const guilds = JSON.parse(fs.readFileSync('./data.json')).guilds;

let commands = [];

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

  guilds.forEach(async (guild) => {
    try {
      console.log(`Started refreshing application (/) commands for guild ${guild.name}.`);

      await rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands });

      console.log(`Successfully reloaded application (/) commands for guild ${guild.name}.`);
    } catch (error) {
      console.error(error);
    }
  });
})();
