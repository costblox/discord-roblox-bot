const { Client, Intents } = require('discord.js');
const axios = require('axios');  // To make API calls to Roblox
require('dotenv').config(); // Import dotenv to load environment variables

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;  // Discord bot token
const BLOXLINK_API_KEY = process.env.BLOXLINK_API_KEY;  // Bloxlink API key (or Roblox API key)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Handling the 'ping' command
  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  // Handling the 'ban' command
  if (commandName === 'ban') {
    const username = interaction.options.getString('username');
    const response = await banRobloxUser(username, false);  // Temporary ban
    if (response.success) {
      await interaction.reply(`${username} has been banned from Roblox.`);
    } else {
      await interaction.reply(`Failed to ban ${username}.`);
    }
  }

  // Handling the 'permaban' command
  if (commandName === 'permaban') {
    const username = interaction.options.getString('username');
    const response = await banRobloxUser(username, true);  // Permanent ban
    if (response.success) {
      await interaction.reply(`${username} has been permanently banned from Roblox.`);
    } else {
      await interaction.reply(`Failed to permanently ban ${username}.`);
    }
  }
});

// Function to ban a Roblox user
async function banRobloxUser(username, permaban = false) {
  try {
    // Set the URL based on the ban type (temporary or permanent)
    const url = permaban 
      ? `https://api.roblox.com/users/${username}/ban`  // Permanent ban endpoint (hypothetical)
      : `https://api.roblox.com/users/${username}/ban-temporarily`;  // Temporary ban endpoint (hypothetical)

    // Set up the request headers with your Roblox API Key (for authentication)
    const headers = {
      'Authorization': `Bearer ${BLOXLINK_API_KEY}`,
    };

    const response = await axios.post(url, {}, { headers });

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error(`Error banning user: ${error}`);
    return { success: false };
  }
}

// Log the bot in using the Discord Token from environment variables
client.login(DISCORD_TOKEN);

