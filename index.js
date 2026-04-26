const { 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    REST, 
    Routes, 
    AttachmentBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');
const { obfuscate } = require('./obfuscator');
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => { res.writeHead(200); res.end('OK'); }).listen(PORT);

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Función para generar la fila de estrellas
function createStarRow(rating = 0) {
    const row = new ActionRowBuilder();
    for (let i = 1; i <= 5; i++) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`star_${i}`)
                .setLabel('★')
                .setStyle(i <= rating ? ButtonStyle.Primary : ButtonStyle.Secondary)
        );
    }
    return row;
}

const command = new SlashCommandBuilder()
    .setName('obf')
    .setDescription('Protect your code')
    .addStringOption(o => o.setName('code').setDescription('Paste your Lua code').setRequired(false))
    .addAttachmentOption(o => o.setName('file').setDescription('Upload a .lua file').setRequired(false));

client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: [command.toJSON()] });
    console.log(`Bot listo: ${client.user.tag}`);
});

function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        mod.get(url, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d)); }).on('error', reject);
    });
}

client.on('interactionCreate', async interaction => {
    // Manejar el comando /obf
    if (interaction.isChatInputCommand() && interaction.commandName === 'obf') {
        const codeOption = interaction.options.getString('code');
        const fileOption = interaction.options.getAttachment('file');

        if (!codeOption && !fileOption) return interaction.reply({ content: 'Provide `code` or a `file`.', ephemeral: true });

        await interaction.deferReply();

        try {
            let src = fileOption ? await fetchURL(fileOption.url) : codeOption;
            const obfuscated = obfuscate(src);
            const buf = Buffer.from(obfuscated, 'utf-8');

            const attachment = new AttachmentBuilder(buf, { name: 'obfuscated.lua' });

            const embed = new EmbedBuilder()
                .setColor(0x0099FF) // Azul
                .setDescription(`**Status**\nNormal\n\n\n**Rate**`);

            await interaction.editReply({
                files: [attachment],
                embeds: [embed],
                components: [createStarRow(0)]
            });

        } catch (e) {
            console.error(e);
            await interaction.editReply('An error occurred.');
        }
    }

    // Manejar los clics en las estrellas
    if (interaction.isButton() && interaction.customId.startsWith('star_')) {
        const rating = parseInt(interaction.customId.split('_')[1]);
        
        // Editamos el mensaje original con las nuevas estrellas iluminadas
        await interaction.update({
            components: [createStarRow(rating)]
        });
    }
});

client.login(TOKEN);
