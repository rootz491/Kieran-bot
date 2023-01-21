import { bot } from './../../index';
import {
  EmbedBuilder,
  TextChannel,
  AttachmentBuilder,
  Message,
  User,
} from 'discord.js';
import { FetchMessageOptions } from '../../types/message';
import { Ticket } from '../../types/ticket';

export const closeTicket = async (ticketChanneId: string, loggingChannelId: string, ticketClosedBy: string) => {
  const ticketChannel = (await bot.getMainGuild()).channels.cache.get(ticketChanneId) as TextChannel;
  const loggingChannel = (await bot.getManagementGuild()).channels.cache.get(loggingChannelId) as TextChannel;

  if (ticketChannel == null) {
    console.log('Ticket channel not found!');
    return false;
  } else if (loggingChannel == null) {
    console.log('Logging channel not found!');
    return false;
  }

  const ticketId = ticketChannel.topic?.split('|')[3].trim();
  const ticket = bot.ticketData.find((ticket) => ticket.id === ticketId);
  if (ticket == null) {
    console.log('Ticket not found!');
    return false;
  }

  await sendTranscript(ticketChannel, loggingChannel, ticket, ticketClosedBy, async () => {
  await ticketChannel
    .delete()
    .then(() => true)
    .catch(() => false);
  });

  return true;
};

export const sendTranscript = async (
  ticketChannel: TextChannel,
  loggingChannel: TextChannel,
  ticket: Ticket,
  ticketClosedBy: string,
  callback: () => Promise<void>
) => {

  const messages = await fetchMessages(ticketChannel, { reverseArray: true });
  if (!messages.length) return;

  const messagesAsStrings = messages.map((message) => {
    const msgTime = message.createdAt;
    const userTag = message.author.tag;
    const userId = message.author.id;
    const content = message.content;
    const isEdited = message.editedAt !== null;

    return `[${msgTime}] ${userTag} (${userId}): ${content}${
      isEdited ? ' (edited)' : ''
    }`;
  });
  const transcript = new AttachmentBuilder(
    Buffer.from(messagesAsStrings.join('\n'), 'utf-8'),
    {
      name: `${ticketChannel.name}.txt`
    }
  );

  const ticketCreatorID = ticketChannel.topic?.split("|")[1].trim(); 
  loggingChannel
    .send({
      content: [
        `**${ticket.name}**`,
        'Ticket Created by: <@' + ticketCreatorID + '>',
        'Ticket Closed by: <@' + ticketClosedBy + '>',
      ].join('\n'),
      files: [transcript]
    })
    .then(() => console.log('Transcript sent to logging channel!'))
    .then(callback)
    .catch((_) => {
      console.log('Could not send transcript to logging channel!');
    });

};

export const fetchMessages = async (
  channel: TextChannel,
  options: FetchMessageOptions = {
    reverseArray: false,
    userOnly: false,
    botOnly: false,
    pinnedOnly: false
  }
): Promise<Message[]> => {
  const { reverseArray, userOnly, botOnly, pinnedOnly } = options;
  let messages: Message[] = [];
  let lastID: string | undefined;

  while (true) {
    let fetchedMessages;
    try {
      fetchedMessages = await channel.messages.fetch({
        limit: 100,
        ...(lastID && { before: lastID })
      });
    } catch {
      return messages;
    }

    if (fetchedMessages.size === 0) {
      if (reverseArray) messages = messages.reverse();
      if (userOnly) messages = messages.filter((msg) => !msg.author.bot);
      if (botOnly) messages = messages.filter((msg) => msg.author.bot);
      if (pinnedOnly) messages = messages.filter((msg) => msg.pinned);
      return messages;
    }

    messages = messages.concat(Array.from(fetchedMessages.values()));
    lastID = fetchedMessages.lastKey();
  }
};

export const isTicketChannel = async (
  channel: TextChannel
): Promise<boolean> => {
  try {
    const ticketCreatorTag = channel.topic?.split("'").shift()?.toLowerCase();
    const ticketCreatorName = ticketCreatorTag?.split('#').join('');
    // TODO update this check based on categories provided in config
    if (
      !channel.name.startsWith(`support-${ticketCreatorName}`) &&
      !channel.name.startsWith(`order-${ticketCreatorName}`)
    )
      return false;
  } catch {
    return false;
  }
  return true;
};
