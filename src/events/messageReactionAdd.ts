import { Events, MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { bot } from '..';

export default {
  name: Events.MessageReactionAdd,
  once: false,
  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) {
    try {

      /* return if user is bot */
      if (user.bot) {
        return;
      }


      const roles = bot.commandData.find(
        (command) => command.name === 'roles'
      )?.roles;

      const rulesEmbedTitle = bot.commandData.find(
        (command) => command.name === 'roles'
      )?.embed.title;

      /* Early leave if the message is not sent to a guild. */
      if (!reaction.message.guild) {
        return;
      }

      /* Get the member that reacted originally. */
      const member = await reaction.message.guild.members.fetch(user.id);
      if (!member) {
        return;
      }

      //  fetch message
      const message = await reaction.message.channel.messages.fetch(reaction.message.id);
      if (!message) {
        return;
      }

      const embed = message.embeds[0];
      if (!embed) {
        return;
      }

      //  get message embed
      const messageEmbed = message.embeds[0];
      if (!messageEmbed) {
        return;
      }

      if (messageEmbed.title != rulesEmbedTitle) {
        return;
      }

      const roleData = roles?.find((role) => role.emoji === reaction.emoji.name);

      if (!roleData) {
        return;
      }

      const role = await reaction.message.guild.roles.fetch(roleData?.id as string);

      if (role) {
        await member.roles.add(role);
        console.log(`Added role ${role.name} to ${member.user.username}`);
      }

      //  remove reaction from user
      await reaction.users.remove(user.id);

    } catch (error) {
      console.log(error);
    }
  }
};
