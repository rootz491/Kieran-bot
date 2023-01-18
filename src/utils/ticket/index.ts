import { bot } from './../../index';
import {
  EmbedBuilder,
  TextChannel,
  AttachmentBuilder,
  Message,
} from 'discord.js';
import { FetchMessageOptions } from '../../types/message';

export const closeTicket = async (ticketChanneId: string, reason: string, loggingChannelId: string) => {
  const ticketChannel = (await bot.getMainGuild()).channels.cache.get(ticketChanneId) as TextChannel;
  const loggingChannel = (await bot.getManagementGuild()).channels.cache.get(loggingChannelId) as TextChannel;

  if (ticketChannel == null) {
    console.log('Ticket channel not found!');
    return false;
  } else if (loggingChannel == null) {
    console.log('Logging channel not found!');
    return false;
  }

  await sendTranscript(ticketChannel, reason, loggingChannel, async () => {
  await ticketChannel
    .delete()
    .then(() => true)
    .catch(() => false);
  });

  return true;
};

export const sendTranscript = async (
  ticketChannel: TextChannel,
  reason: string,
  loggingChannel: TextChannel,
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

  const ticketCreatorTag = ticketChannel.topic?.split("'").shift();
  const embed = new EmbedBuilder()
    .setColor('#3459d3')
    .setTitle(`Ticket Closed`)
    .setDescription(
      [
        `${ticketCreatorTag}'s ticket #${ticketChannel.name} (${ticketChannel.id}) has been closed.`,
        'A transcript is available above.'
      ].join('\n')
    )
    .addFields([
      {
        name: 'Ticked Opened On',
        value: `${ticketChannel.createdAt}`,
        inline: true
      },
      {
        name: 'Ticked Closed On',
        value: `${new Date()}`,
        inline: true
      },
      {
        name: 'Reason',
        value: reason
      }
    ])
    .setTimestamp();

  loggingChannel
    .send({
      embeds: [embed],
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
