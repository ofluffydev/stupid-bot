import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
export async function add_commands() {
  const commands = [];
  const foldersPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(foldersPath);

  const token = process.env.DISCORD_TOKEN as string;
  const clientId = process.env.CLIENT_ID as string;
  const guildId = process.env.GUILD_ID as string;

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file: string) => file.endsWith('.ts'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`,
        );
      }
    }
  }

  const rest = new REST().setToken(token);

  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      const data = (await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      )) as unknown as Array<Record<string, unknown>>;

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  })();

  console.log('Registered commands:');
  for (const command of commands) {
    console.log(command.name);
  }
}
