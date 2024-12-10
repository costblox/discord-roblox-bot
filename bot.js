const { Client, GatewayIntentBits } = require('discord.js');  // Updated import for discord.js v14+
const axios = require('axios');  // To make API calls to Roblox (Bloxlink)
const express = require('express'); // Import express to keep the bot alive
require('dotenv').config(); // Load environment variables
const { SlashCommandBuilder } = require('@discordjs/builders'); // For defining slash commands

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Use GatewayIntentBits for the correct intents
  ],
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;  // Discord bot token
const BLOXLINK_API_KEY = process.env.BLOXLINK_API_KEY;  // Bloxlink API key

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

// Register commands with Discord (set up in this script)
client.on('ready', async () => {
  const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder().setName('ban')
      .setDescription('Temporarily bans a Roblox user')
      .addStringOption(option => 
        option.setName('username')
              .setDescription('The Roblox username to ban')
              .setRequired(true)),
    new SlashCommandBuilder().setName('permaban')
      .setDescription('Permanently bans a Roblox user')
      .addStringOption(option => 
        option.setName('username')
              .setDescription('The Roblox username to permaban')
              .setRequired(true)),
  ];

  try {
    await client.application.commands.set(commands);
    console.log('Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

// Handling the interaction (command) logic
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
      await interaction.reply(`${username} has been banned temporarily from Roblox.`);
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

// Function to ban a Roblox user (via Bloxlink or another API)
async function banRobloxUser(username, permaban = false) {
  try {
    // Construct the URL based on whether it's a temporary or permanent ban
    const url = permaban 
      ? `https://api.bloxlink.com/v1/ban`  // Example permanent ban endpoint from Bloxlink
      : `https://api.bloxlink.com/v1/tempban`; // Example temporary ban endpoint from Bloxlink

    const headers = {
      'Authorization': `Bearer ${BLOXLINK_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const body = { username };  // Send the username to ban (adjust this if more data is needed)

    const response = await axios.post(url, body, { headers });

    // Check if the ban was successful
    if (response.status === 200) {
      return { success: true };
    } else {
      console.log('Failed to ban user:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.error('Error banning Roblox user:', error.message);
    return { success: false };
  }
}

// Log in the bot
client.login(DISCORD_TOKEN);
