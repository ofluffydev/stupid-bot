import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import ms, { StringValue } from "ms";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("length")
        .setDescription(
          "The length of the timeout (See /help timeout for more info)",
        ),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the timeout"),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided.";
    const length = interaction.options.getString("length") as StringValue;

    if (!user) {
      return interaction.reply("Please provide a user to timeout.");
    }

    await timeoutUser(interaction, user, length, reason);
  },
};

export function parseLength(value: StringValue) {
  ms(value);
}

export async function timeoutUser(
  interaction: ChatInputCommandInteraction,
  user: any,
  length: StringValue,
  reason: string,
) {
  const guildMember = interaction.guild?.members.cache.get(user.id);
  if (!guildMember) {
    return interaction.reply("User is not in the server.");
  }

  if (!length) {
    return interaction.reply("Please provide a length for the timeout.");
  }

  try {
    parseLength(length);
    const parsedLength = ms(length);
    // Uncomment the next line to actually timeout users, wouldn't wanna accidentally timeout myself :P
    // await guildMember.timeout(parsedLength, reason);
    await interaction.reply(
      `Successfully gave ${user.tag} a timeout of ${length}. Reason: ${reason}`,
    );
  } catch (error: any) {
    console.error(error);
    return interaction.reply("Invalid length provided. " + error.message);
  }
}
