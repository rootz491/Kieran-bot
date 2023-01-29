import { EmbedBuilder, Message } from "discord.js";

export default async function giveawayHandler(msg: Message, timeInMs: number, winners: number) {
  try {

    setTimeout(async () => {
      const participants = await msg.reactions.cache.get("🎉")?.users.fetch();

      if (!participants) {
        const newEmbed = new EmbedBuilder()
          .setTitle(msg.embeds[0].title)
          .setDescription(msg.embeds[0].description + `\n\n**ENDED**\n Winner: No one entered!`);
        await msg.edit({ embeds: [newEmbed] });
        return;
      }

      // remove bot from participants
      participants.delete(msg.client.user?.id as string);

      // check if there are enough participants
      if (participants.size < winners) {
        const newEmbed = new EmbedBuilder()
          .setTitle(msg.embeds[0].title)
          .setDescription(msg.embeds[0].description + `\n\n**ENDED**\n Winner: Not enough participants!`);
        await msg.edit({ embeds: [newEmbed] }); 
        return;
      }

      // get winners from participants
      const winner = participants?.random(winners).join(", ");

      if (!winner) {
        const newEmbed = new EmbedBuilder()
          .setTitle(msg.embeds[0].title)
          .setDescription(msg.embeds[0].description + `\n\n**ENDED**\n Winner: No one entered!`);
        await msg.edit({ embeds: [newEmbed] });
        return;
      }


      const embed = msg.embeds[0];
      const newEmbed = new EmbedBuilder()
        .setTitle(embed.title)
        .setDescription(embed.description + `\n\n**ENDED**\n Winner: ${winner}`)
        .setTimestamp();
      await msg.edit({ embeds: [newEmbed] });
    }, timeInMs);
  } catch (error) {
    console.error(error);
  }
}