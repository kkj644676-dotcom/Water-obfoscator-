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

// --- RAILWAY KEEP-ALIVE ---
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => { 
    res.writeHead(200); 
    res.end('VVMER PROTECTOR ONLINE'); 
}).listen(PORT, '0.0.0.0');

// --- CONFIGURATION ---
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- STAR RATING SYSTEM ---
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

// --- SLASH COMMAND SETUP ---
const command = new SlashCommandBuilder()
    .setName('obf')
    .setDescription('Protect your Lua code with VVMER + UnveilX')
    .addStringOption(o => o.setName('code').setDescription('Paste your Lua code').setRequired(false))
    .addAttachmentOption(o => o.setName('file').setDescription('Upload a .lua file').setRequired(false));

// --- BOT READY & REGISTER COMMANDS ---
client.once('ready', async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        console.log('Registering commands...');
        
        await rest.put(
            Routes.applicationCommands(client.user.id), 
            { body: [command.toJSON()] }
        );
        
        console.log(`--- VVMER PROTECTOR READY ---`);
        console.log(`Logged in as: ${client.user.tag}`);
    } catch (error) {
        console.error("Command registration error:", error);
    }
});

// --- HELPER TO DOWNLOAD FILES ---
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

// --- INTERACTION HANDLER ---
client.on('interactionCreate', async interaction => {
    
    // Command Execution
    if (interaction.isChatInputCommand() && interaction.commandName === 'obf') {
        const codeOption = interaction.options.getString('code');
        const fileOption = interaction.options.getAttachment('file');

        if (!codeOption && !fileOption) {
            return interaction.reply({ content: '❌ Error: You must provide a code snippet or a .lua file.', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            let src = fileOption ? await fetchURL(fileOption.url) : codeOption;
            
            // RUN VVMER OBFUSCATION
            const obfuscated = obfuscate(src);
            
            const buf = Buffer.from(obfuscated, 'utf-8');
            const attachment = new AttachmentBuilder(buf, { name: 'protected_vvmer.lua' });

            const embed = new EmbedBuilder()
                .setTitle("🛡️ VVMER PROTECTOR")
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(0x2f3136)
                .addFields(
                    { name: 'Status', value: ' Success', inline: true },
                    { name: 'Protection', value:', inline: true }
                )
                .setDescription(`Your code has been encrypted and wrapped in a Virtual Machine.\n\n**Rate our service:**`)
                .setFooter({ text: 'VVMER Obfuscator Engine' })
                .setTimestamp();

            await interaction.editReply({
                files: [attachment],
                embeds: [embed],
                components: [createStarRow(0)]
            });

        } catch (e) {
            console.error(e);
            await interaction.editReply('❌ **Internal Error:** Could not process obfuscation.');
        }
    }

    // Rating Buttons
    if (interaction.isButton() && interaction.customId.startsWith('star_')) {
        const rating = parseInt(interaction.customId.split('_')[1]);
        
        const embed = EmbedBuilder.from(interaction.message.embeds[0]);
        
        await interaction.update({
            embeds: [embed],
            components: [createStarRow(rating)]
        });
    }
});

client.login(TOKEN);
