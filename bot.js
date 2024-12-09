const { Client, Intents } = require('discord.js');
const axios = require('axios');  // To make API calls to Roblox
const express = require('express'); // Import express to keep the bot alive
require('dotenv').config(); // Load environment variables

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;  // Discord bot token
const BLOXLINK_API_KEY = process.env.BLOXLINK_API_KEY;  // Bloxlink API key (or Roblox API key)

const app = express();

// Use Render's environment variable for port binding
const port = process.env.PORT || 3000;  // Ensure we're binding to the correct port

// Keep the bot alive with a simple HTTP server
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});

// Discord bot logic
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
    const url = permaban 
      ? `https://api.roblox.com/users/${username}/ban`  
      : `https://api.roblox.com/users/${username}/ban-temporarily`;  

    const headers = {
      'Authorization': `Bearer ${BLOXLINK_API_KEY}`,
    };

    const response = await axios.post(url, {}, { headers });

    if (response.status === 200) {
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Error banning Roblox user:', error);
    return { success: false };
  }
}

client.login(DISCORD_TOKEN);
