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

// IMPORTANTE: Asegúrate de que el archivo se llame 'obfuscator.js'
const { obfuscate } = require('./obfuscator'); 
const http = require('http');
const https = require('https');

// Servidor para Railway (Evita que el bot se apague)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => { 
    res.writeHead(200); 
    res.end('VVMER Bot is Running'); 
}).listen(PORT, '0.0.0.0');

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
    .setDescription('Protect your code with VVMER + UnveilX')
    .addStringOption(o => o.setName('code').setDescription('Paste your Lua code').setRequired(false))
    .addAttachmentOption(o => o.setName('file').setDescription('Upload a .lua file').setRequired(false));

client.once('ready', async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: [command.toJSON()] });
        console.log(`--- VVMER ONLINE ---`);
        console.log(`Bot logueado como: ${client.user.tag}`);
    } catch (error) {
        console.error("Error al registrar comandos:", error);
    }
});

// Función para descargar archivos adjuntos
function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        mod.get(url, res => { 
            let d = ''; 
            res.on('data', c => d += c); 
            res.on('end', () => resolve(d)); 
        }).on('error', reject);
    });
}

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'obf') {
        const codeOption = interaction.options.getString('code');
        const fileOption = interaction.options.getAttachment('file');

        if (!codeOption && !fileOption) {
            return interaction.reply({ content: '❌ Debes proporcionar código o un archivo .lua', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            // Obtener el código fuente
            let src = fileOption ? await fetchURL(fileOption.url) : codeOption;
            
            // EJECUTAR OFUSCACIÓN
            const obfuscated = obfuscate(src);
            
            const buf = Buffer.from(obfuscated, 'utf-8');
            const attachment = new AttachmentBuilder(buf, { name: 'obfuscated.lua' });

            const embed = new EmbedBuilder()
                .setTitle("🛡️ VVMER Obfuscator")
                .setColor(0x00FF00)
                .setDescription(`**Status:** Success\n**Protection:** UnveilX + VM 18x\n\nPor favor, califica el servicio:`)
                .setTimestamp();

            await interaction.editReply({
                files: [attachment],
                embeds: [embed],
                components: [createStarRow(0)]
            });

        } catch (e) {
            console.error("Error en ofuscación:", e);
            await interaction.editReply('❌ Error interno al ofuscar el código.');
        }
    }

    if (interaction.isButton() && interaction.customId.startsWith('star_')) {
        const rating = parseInt(interaction.customId.split('_')[1]);
        await interaction.update({
            components: [createStarRow(rating)]
        });
    }
});

client.login(TOKEN);
