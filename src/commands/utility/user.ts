import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription(
          'User to get info on, defaults to the user running the command.',
        )
        .setRequired(false),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply('This command can only be used in a server.');
    }

    const user = interaction.options.getUser('user');
    const member = user
      ? ((await interaction.guild?.members.fetch(user)) as GuildMember)
      : (interaction.member as GuildMember);
    const name = member.user.username;
    const joinedAt = member.joinedAt
      ? member.joinedAt.toDateString()
      : 'Unknown';

    const serverName = interaction.guild?.name;

    const profilePicture = member.user.displayAvatarURL();
    const embed = new EmbedBuilder()
      .setColor(0xbe2ed6)
      .setTitle(name)
      .addFields({ name: 'Join Date', value: joinedAt })
      .setImage(profilePicture)
      .setTimestamp()
      .setFooter({
        text: serverName ?? 'Unknown Server',
      });

    const channel = interaction.channel;
    if (!channel) {
      interaction.reply('Could not find channel.');
    } else {
      interaction.reply({ embeds: [embed] });
    }
  },
};
