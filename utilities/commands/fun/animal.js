const { SlashCommandBuilder } = require('@discordjs/builders');
const randomAnimal = require('random-animal.js');

module.exports = {
  name: 'animal',
  data: new SlashCommandBuilder()
    .setName('animal')
    .setDescription('Sends a photo of a random animal of the selected species.')
    .addStringOption((x) =>
      x
        .setName('species')
        .setDescription('Select an animal species.')
        .setRequired(true)
        .addChoices([
          ['dog', 'dog'],
          ['cat', 'cat'],
          ['koala', 'koala'],
          ['fox', 'fox'],
          ['bird', 'bird'],
          ['panda', 'panda'],
          ['red panda', 'redpanda'],
        ]),
    ),
  exec: function (interaction) {
    switch (interaction.options.getString('species')) {
      case 'dog':
        randomAnimal.randomDog().then((e) => {
          interaction.reply(e);
        });
        break;
      case 'cat':
        randomAnimal.randomCat().then((e) => {
          interaction.reply(e);
        });
        break;
      case 'koala':
        randomAnimal.randomKoala().then((e) => {
          interaction.reply(e);
        });
        break;
      case 'fox':
        randomAnimal.randomFox().then((e) => {
          interaction.reply(e);
        });
        break;
      case 'bird':
        randomAnimal.randomBird().then((e) => {
          interaction.reply(e);
        });
        break;
      case 'panda':
        randomAnimal.randomPanda().then((e) => {
          interaction.reply(e);
        });
        break;
      case 'redpanda':
        randomAnimal.randomRedPanda().then((e) => {
          interaction.reply(e);
        });
        break;
    }
  },
};
