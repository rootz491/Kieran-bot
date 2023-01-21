import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { bot } from "..";

export default function embedBuilder(commandName: string) {
  try {
    const EmbedData = bot.commandData.find(
          (command) => command.name === commandName
        );
  
    if (EmbedData) {
      const embed = new EmbedBuilder()
        .setTitle(EmbedData.embed.title)
        .setDescription(EmbedData.embed.description ?? '')
        .setColor(EmbedData.embed.color as ColorResolvable ?? 'RANDOM');
    
      if (EmbedData.embed.footer.text !== '') {
        embed.setFooter({
          text: EmbedData.embed.footer?.text ?? '-',
        });
      }
    
      if (EmbedData.embed.footer.icon_url !== '' && EmbedData.embed.footer.text !== '') {
        embed.setFooter({
          iconURL: EmbedData.embed.footer.icon_url,
          text: EmbedData.embed.footer.text
        });
      }
    
      if (EmbedData.embed.timestamp) {
        embed.setTimestamp();
      }
    
      if (EmbedData.embed.fields?.length > 0) {
        embed.addFields(EmbedData.embed.fields.map((field) => field));
      }

      return {
        success: true,
        embed: embed
      };
      
    } else {
      return {
        success: false,
        error: 'This command data is not available at the moment.'
      }
    }
    
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'An error occurred while executing this command.'
    }
  }
}