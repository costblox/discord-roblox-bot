// bot.js
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Create a new Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// Get your Discord token from environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command to verify Roblox account via Bloxlink
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!roblox_verify')) {
    const discordUserId = message.content.split(' ')[1]; // Get the Discord user ID

    if (!discordUserId) {
      return message.reply('Please provide a Discord user ID.');
    }

    // Call the Bloxlink API to verify the Roblox account linked to the Discord ID
    const url = `https://api.bloxlink.com/v1/discord/${discordUserId}`;
    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${process.env.BLOXLINK_API_KEY}` }
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
