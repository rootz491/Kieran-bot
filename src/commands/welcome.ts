// TODO create all commands whose configs are available in the command config file
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Send a welcome message to the user'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('test');
  }
};
