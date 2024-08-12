import {
  ChatInputCommandInteraction,
  GuildMember,
  RoleResolvable,
  SlashCommandBuilder,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Promotes a user to admin')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to promote')
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    const adminRole = interaction.options.getRole('admin');
    if (!user) {
      return interaction.reply('Please provide a user to promote.');
    }
    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;
    if (!member) {
      return interaction.reply('User is not a member of this server.');
    }
    if (member.roles.cache.some((role) => role.name === adminRole?.name)) {
      return interaction.reply('User is already an admin.');
    } else {
      const roleID = process.env.ADMIN_ROLE as string;
      const role: RoleResolvable = interaction.guild?.roles.cache.get(
        roleID,
      ) as RoleResolvable;
      try {
        await member.roles.add(role);
      } catch (error) {
        return interaction.reply('Failed to promote user.');
      }
    }
  },
};
