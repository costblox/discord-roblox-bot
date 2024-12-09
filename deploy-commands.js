const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;  // Your bot's client ID
const guildId = process.env.GUILD_ID;  // Your guild's ID (for testing in specific server)
const token = process.env.DISCORD_TOKEN;  // Discord bot token from environment

// Registering commands
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  new SlashCommandBuilder().setName('ban').setDescription('Ban a Roblox user.')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username of the player you want to ban.')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('permaban').setDescription('Permanently ban a Roblox user.')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username of the player you want to permanently ban.')
        .setRequired(true)
    ),
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId), // Register for guild
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
