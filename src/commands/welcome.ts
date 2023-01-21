// TODO create all commands whose configs are available in the command config file
import { ColorResolvable, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { bot } from '..';

export default {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Send a welcome message to the user'),
  async execute(interaction: CommandInteraction) {
    try {
      const welcomeEmbedData = bot.commandData.find(
        (command) => command.name === 'welcome'
      );
  
      if (welcomeEmbedData) {
        const embed = new EmbedBuilder()
          .setTitle(welcomeEmbedData.embed.title)
          .setDescription(welcomeEmbedData.embed.description ?? '')
          .setColor(welcomeEmbedData.embed.color as ColorResolvable ?? 'RANDOM');
  
        if (welcomeEmbedData.embed.footer.text !== '') {
          embed.setFooter({
            text: welcomeEmbedData.embed.footer?.text ?? '-',
          });
        }
  
        if (welcomeEmbedData.embed.footer.icon_url !== '' && welcomeEmbedData.embed.footer.text !== '') {
          embed.setFooter({
            iconURL: welcomeEmbedData.embed.footer.icon_url,
            text: welcomeEmbedData.embed.footer.text
          });
        }
  
        if (welcomeEmbedData.embed.timestamp) {
          embed.setTimestamp();
        }
  
        if (welcomeEmbedData.embed.fields?.length > 0) {
          embed.addFields(welcomeEmbedData.embed.fields.map((field) => field));
        }
  
        await interaction.channel?.send({
          embeds: [embed],
        });
  
        await interaction.reply({
          content: 'Welcome message sent!',
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
