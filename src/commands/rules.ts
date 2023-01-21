// TODO create all commands whose configs are available in the command config file
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import embedBuilder from '../utils/EmbedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Send a Rules message to the user'),
  async execute(interaction: CommandInteraction) {
    try {
      
      const embedRes = embedBuilder('rules');

      if (embedRes.success === false) {
        await interaction.reply({
          content: embedRes.error,
          ephemeral: true,
        });
        return;
      }

      if (embedRes.embed != null) {

        await interaction.channel?.send({
          embeds: [embedRes.embed],
        });
  
        await interaction.reply({
          content: 'Embed sent!',
          ephemeral: true,
        });
  
        setTimeout(() => {
          interaction.deleteReply();
        }, 4000);
        return;
  
      } else {
        await interaction.reply({
          content: 'This command data is not available at the moment.',
          ephemeral: true,
        });
        return;
      }


    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'An error occurred while executing this command.',
        ephemeral: true,
      });
    }
  }
};
