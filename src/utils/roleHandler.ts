import { Message } from 'discord.js';
import { bot } from '..';

export default async function rolesHandler(msg: Message) {
  try {
    const roleEmojis = bot.commandData
      .find((command) => command.name === 'roles')
      ?.roles?.map((role) => role.emoji);
    if (roleEmojis) {
      for (const emoji of roleEmojis) {
        await msg.react(emoji);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
