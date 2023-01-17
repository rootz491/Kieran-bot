import { bot } from './../../index';
import {
  EmbedBuilder,
  TextChannel,
  AttachmentBuilder,
  Message,
  User
} from 'discord.js';
import config from '../../configs/config';
import { FetchMessageOptions } from '../../types/message';

export const closeTicket = async (channelId: string, reason: string) => {
  const channel = bot.client.channels.cache.get(channelId) as TextChannel;

  const userID = channel.topic?.split('|').pop()?.replace(' ', '');

  const user = await bot.client.users
    .fetch(userID as string)
    .catch((_) => null);

  if (user != null) sendTranscript(channel, user, reason);

  channel
    .delete()
    .then(() => true)
    .catch(() => false);
};

export const sendTranscript = async (
  channel: TextChannel,
  user: User,
  reason: string
) => {
  const messages = await fetchMessages(channel, { reverseArray: true });
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

  const transcriptChannelId = 'CHANNEL_ID'; //  TODO update this later

  const transcriptChannel = channel.guild.channels.cache.get(
    transcriptChannelId
  ) as TextChannel | undefined;
  if (!transcriptChannel) return;

  const transcript = new AttachmentBuilder(
    Buffer.from(messagesAsStrings.join('\n'), 'utf-8'),
    {
      name: `${channel.name}.txt`
    }
  );

  const ticketCreatorTag = channel.topic?.split("'").shift();
  const embed = new EmbedBuilder()
    .setColor('#3459d3')
    .setTitle(`Ticket Closed`)
    .setDescription(
      [
        `${ticketCreatorTag}'s ticket #${channel.name} (${channel.id}) has been closed.`,
        'A transcript is available above.'
      ].join('\n')
    )
    .addFields([
      {
        name: 'Ticked Opened On',
        value: `${channel.createdAt}`,
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

  transcriptChannel
    .send({
      embeds: [embed],
      files: [transcript]
    })
    .catch((_) => {
      //
    });

  user
    .send({
      embeds: [embed],
      files: [transcript]
    })
    .catch((_) => null);
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
