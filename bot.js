// Import necessary libraries
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Get the environment variables from Glitch's Secrets
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const BLOXLINK_API_KEY = process.env.BLOXLINK_API_KEY;

// Create a new Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// Bot startup event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command to verify Roblox account via Bloxlink and assign a role
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!roblox_verify')) {
    const discordUserId = message.content.split(' ')[1];  // Get Discord user ID

    if (!discordUserId) {
      return message.reply('Please provide a Discord user ID.');
    }

    // Verify the Roblox account linked to the Discord ID using Bloxlink API
    const url = `https://api.bloxlink.com/v1/discord/${discordUserId}`;
    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${BLOXLINK_API_KEY}` }
      });

      if (response.data.roblox_username) {
        message.reply(`The Discord user is linked to Roblox user: ${response.data.roblox_username}`);
      } else {
        message.reply('No Roblox account linked to this Discord user.');
      }
    } catch (error) {
      message.reply('Failed to verify Roblox account.');
    }
  }
});

// Log in to Discord with the bot token
client.login(DISCORD_TOKEN);
