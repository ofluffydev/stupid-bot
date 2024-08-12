import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the kick"),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided.";

    if (!user) {
      return interaction.reply("Please provide a user to ban.");
    }

    // Uncomment the next line to actually ban users, wouldn't wanna accidentally kick myself either :P
    // await interaction.guild?.members.kick(user);

    await interaction.reply(
      `Successfully kicked ${user.tag}. Reason: ${reason}`,
    );
  },
};
