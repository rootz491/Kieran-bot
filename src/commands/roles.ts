import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import embedBuilder from '../utils/EmbedBuilder';
import rolesHandler from '../utils/roleHandler';

export default {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Send a Roles message to the user'),
  async execute(interaction: CommandInteraction) {
    try {
      const embedRes = embedBuilder('roles');

      if (embedRes.success === false) {
        await interaction.reply({
          content: embedRes.error,
          ephemeral: true,
        });
        return;
      }
  
      if (embedRes.embed != null) {

        const msg = await interaction.channel?.send({
          embeds: [embedRes.embed],
        });
  
        await interaction.reply({
          content: 'Embed sent!',
          ephemeral: true,
        });

        if (msg) rolesHandler(msg);
  
        setTimeout(() => {
          interaction.deleteReply();
        }, 4000);
  
      } else {
        await interaction.reply({
          content: 'This command data is not available at the moment.',
          ephemeral: true,
        });
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
