import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import ms from 'ms';
import { startTime } from '../..';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Provides information about the bot.'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply('This command can only be used in a server.');
    }

    const member = interaction.member as GuildMember;
    // Get the current bot name
    const client = interaction.client;
    const name = client.user.username;
    const runningSince: string = startTime;
    const uptime = getUptime(client);

    const serverName = interaction.guild?.name;

    const profilePicture = client.user.displayAvatarURL();
    const embed = new EmbedBuilder()
      .setColor(0xbe2ed6)
      .setTitle(name)
      .addFields({ name: 'Running Since', value: runningSince })
      .addFields({ name: 'Uptime', value: ms(uptime) })
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
function getUptime(client: Client) {
  const currentTime = new Date().getTime();
  const readyAt = client.readyAt?.getTime() ?? new Date().getTime();
  const uptime = currentTime - readyAt;
  return uptime;
}
