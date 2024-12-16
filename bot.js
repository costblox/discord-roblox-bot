const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');
require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const BLOXLINK_API_KEY = process.env.BLOXLINK_API_KEY;

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(port, () => {
    console.log(`HTTP server is running on port ${port}`);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (commandName === 'ban') {
        const username = interaction.options.getString('username');
        const response = await banRobloxUser(username, false);
        if (response.success) {
            await interaction.reply(`${username} has been banned temporarily from Roblox.`);
        } else {
            await interaction.reply(`Failed to ban ${username}.`);
        }
    }

    if (commandName === 'permaban') {
        const username = interaction.options.getString('username');
        const response = await banRobloxUser(username, true);
        if (response.success) {
            await interaction.reply(`${username} has been permanently banned from Roblox.`);
        } else {
            await interaction.reply(`Failed to permanently ban ${username}.`);
        }
    }
});

async function banRobloxUser(username, permaban = false) {
    try {
        const url = permaban
            ? `https://api.bloxlink.com/v1/ban`
            : `https://api.bloxlink.com/v1/tempban`;

        const headers = {
            'Authorization': `Bearer ${BLOXLINK_API_KEY}`,
            'Content-Type': 'application/json',
        };

        const body = { username };

        const response = await axios.post(url, body, { headers });

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

client.login(DISCORD_TOKEN);
