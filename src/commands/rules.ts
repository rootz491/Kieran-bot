// TODO create all commands whose configs are available in the command config file
import { ColorResolvable, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { bot } from '..';

export default {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Send a Rules message to the user'),
  async execute(interaction: CommandInteraction) {
    try {
      const rulesEmbedData = bot.commandData.find(
        (command) => command.name === 'rules'
      );
  
      if (rulesEmbedData) {
        const embed = new EmbedBuilder()
          .setTitle(rulesEmbedData.embed.title)
          .setDescription(rulesEmbedData.embed.description ?? '')
          .setColor(rulesEmbedData.embed.color as ColorResolvable ?? 'RANDOM');
  
        if (rulesEmbedData.embed.footer.text !== '') {
          embed.setFooter({
            text: rulesEmbedData.embed.footer?.text ?? '-',
          });
        }
  
        if (rulesEmbedData.embed.footer.icon_url !== '' && rulesEmbedData.embed.footer.text !== '') {
          embed.setFooter({
            iconURL: rulesEmbedData.embed.footer.icon_url,
            text: rulesEmbedData.embed.footer.text
          });
        }
  
        if (rulesEmbedData.embed.timestamp) {
          embed.setTimestamp();
        }
  
        if (rulesEmbedData.embed.fields?.length > 0) {
          embed.addFields(rulesEmbedData.embed.fields.map((field) => field));
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
