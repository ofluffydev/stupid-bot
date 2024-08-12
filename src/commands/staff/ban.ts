import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to ban')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for the ban'),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    const reason =
      interaction.options.getString('reason') ?? 'No reason provided.';

    if (!user) {
      return interaction.reply('Please provide a user to ban.');
    }

    // Uncomment the next line to actually ban users, wouldn't wanna accidentally ban myself :P
    // await interaction.guild?.members.ban(user);

    await interaction.reply(
      `Successfully banned ${user.tag}. Reason: ${reason}`,
    );
  },
};
