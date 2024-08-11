import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Client, Collection, Events, GatewayIntentBits, Interaction, ChatInputCommandInteraction } from "discord.js";

const {token} = require('./config.json');

if (!token) {
  console.error("Token is required to run this example.");
  process.exit(1);
}

interface Command {
  data: {
    name: string;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

class ExtendedClient extends Client {
  commands: Collection<string, Command>;

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
    this.commands = new Collection();
  }
}

const client = new ExtendedClient();

const foldersPath = join(__dirname, "commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath) as Command;
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`  - Registered command: ${command.data.name}`);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  // Print information about the server the bot is connected to
  console.log(`Connected to ${readyClient.guilds.cache.size} servers:`);
  readyClient.guilds.cache.forEach((guild) => {
	console.log(`  - ${guild.name} (ID: ${guild.id})`);
  });
  console.log("Registered commands:");
  client.commands.forEach((command) => {
    console.log(`  - ${command.data.name}`);
  });
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.login(token);