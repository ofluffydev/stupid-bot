import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('infract')
    .setDescription('infract a user'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Not implemented');
  },
};
