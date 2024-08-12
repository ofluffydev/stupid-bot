import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply('This command can only be used in a server.');
    }

    const member = interaction.member as GuildMember;
    const joinedAt = member.joinedAt
      ? member.joinedAt.toDateString()
      : 'Unknown';

    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${joinedAt}.`,
    );
  },
};
