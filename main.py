import discord
from discord.ext import commands
from discord import app_commands
import os
import io
# Importamos tu sistema de ofuscación
from obfuscator import obfuscate

class StarRating(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    async def handle_stars(self, interaction: discord.Interaction, rating: int):
        for child in self.children:
            if isinstance(child, discord.ui.Button):
                star_num = int(child.custom_id.split('_')[1])
                # Ilumina las estrellas anteriores y la seleccionada
                child.style = discord.ButtonStyle.primary if star_num <= rating else discord.ButtonStyle.secondary
        
        await interaction.response.edit_message(view=self)

    @discord.ui.button(label="★", style=discord.ButtonStyle.secondary, custom_id="star_1")
    async def s1(self, i, b): await self.handle_stars(i, 1)

    @discord.ui.button(label="★", style=discord.ButtonStyle.secondary, custom_id="star_2")
    async def s2(self, i, b): await self.handle_stars(i, 2)

    @discord.ui.button(label="★", style=discord.ButtonStyle.secondary, custom_id="star_3")
    async def s3(self, i, b): await self.handle_stars(i, 3)

    @discord.ui.button(label="★", style=discord.ButtonStyle.secondary, custom_id="star_4")
    async def s4(self, i, b): await self.handle_stars(i, 4)

    @discord.ui.button(label="★", style=discord.ButtonStyle.secondary, custom_id="star_5")
    async def s5(self, i, b): await self.handle_stars(i, 5)

class MimosaBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        await self.tree.sync()

bot = MimosaBot()

@bot.tree.command(name="obf", description="Protect your code")
@app_commands.describe(code="Paste your Lua code", file="Upload a .lua file")
async def obf(interaction: discord.Interaction, code: str = None, file: discord.Attachment = None):
    if not code and not file:
        return await interaction.response.send_message("Provide `code` or a `file`.", ephemeral=True)

    await interaction.response.defer()

    try:
        # Obtener código
        source = (await file.read()).decode('utf-8') if file else code
        
        # Llamar a la función del otro archivo
        result = obfuscate(source)
        
        # Preparar el archivo de salida
        file_buffer = io.BytesIO(result.encode('utf-8'))
        discord_file = discord.File(file_buffer, filename="obfuscated.lua")

        # Embed Azul con el formato exacto
        embed = discord.Embed(
            color=0x00a2ff, # Azul
            description="**status**\nnormal\n\n\n**rate**"
        )

        # Respuesta: Primero el archivo, luego el embed con botones
        await interaction.followup.send(
            file=discord_file,
            embed=embed,
            view=StarRating()
        )

    except Exception as e:
        await interaction.followup.send(f"Error: {e}")

# Railway: Configura la variable DISCORD_TOKEN en el panel
TOKEN = os.getenv("DISCORD_TOKEN")
bot.run(TOKEN)

