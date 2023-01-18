import {
  Guild,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ModalSubmitInteraction,
  TextChannel,
  PermissionsBitField,
  ButtonStyle,
  OverwriteType,
  PermissionFlagsBits,
  ColorResolvable,
  ChannelType,
  Message
} from 'discord.js';
import { bot } from '../..';
import { Ticket } from '../../types/ticket';

export const createTicket = async (
  interaction: ModalSubmitInteraction,
  description: string,
  ticket: Ticket,
  userId: string
) => {
  if (ticket.type === 'CHAT') {
    //  create a channel, add admin, staff & user
    const ticketChannel = await interaction.guild!.channels.create({
      name: `ticket-${interaction.user.tag}`,
      parent: ticket.categoryId,
      reason: `${interaction.user.tag} (${interaction.user.id}) made a ${ticket.name} ticket of ticket type ${ticket.type} with id ${ticket.id}`,
      topic: `${interaction.user.tag}'s ticket | ${interaction.user.id} | ${ticket.type} | ${ticket.id}`,
      permissionOverwrites: [
        { id: interaction.guild!.id, deny: [PermissionsBitField.All] },
        {
          id: interaction.user.id,
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.UseExternalEmojis,
            PermissionFlagsBits.AddReactions
          ]
        },
        {
          id: bot.config.ROLES.ADMIN_ROLE_ID,
          type: OverwriteType.Role,
          allow: [PermissionsBitField.All]
        },
        {
          id: bot.config.ROLES.STAFF_ROLE_ID,
          type: OverwriteType.Role,
          allow: [PermissionsBitField.All]
        }
      ]
    });
    //  prepare an embed with support information
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`resolve-${ticketChannel.id}`) //  TODO maybe update this based on ticket type
        .setLabel('Resolve Ticket')
        .setStyle(ButtonStyle.Danger)
    );
    const confirmationEmbed = new EmbedBuilder()
      .setTitle('Ticket Request')
      .setColor(bot.config.COLORS.SUCCESS as ColorResolvable)
      .setDescription(
        `Hey, ${interaction.user}. Your ticket has been created: ${ticketChannel}`
      );
  
    const ticketInitEmbed = new EmbedBuilder()
      .setTitle(ticket.name)
      .setColor(bot.config.COLORS.MAIN as ColorResolvable)
      .setDescription(
        ticket.description + '\n\n**Description:** \n' + description
      );
  
    //  send msg in ticket channel & pin it!
    const message = await ticketChannel.send({
      embeds: [ticketInitEmbed],
      components: [row]
    });
    await message.pin();
  
    const linkRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel('Go to Ticket')
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/channels/${ticketChannel.guildId}/${ticketChannel.id}`
        )
    );
    //  ping admin & player who initiated order
    await interaction.reply({
      embeds: [confirmationEmbed],
      components: [linkRow],
      ephemeral: true
    });

    setTimeout(() => {
      interaction.deleteReply().catch((err) => console.log(err));
    }, 2000);

    return {
      success: true,
    };
  } else if (ticket.type === 'APPLICATION' || ticket.type === 'TEST-APPLICATION') {
    const ticketChannel = await interaction.guild!.channels.fetch(ticket.channelId);
    if (!ticketChannel) return {
      success: false,
      error: 'Ticket channel not found'
    };

    if (ticketChannel.type !== ChannelType.GuildText) return {
      success: false,
      error: 'Ticket channel is not a text channel'
    };

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${userId}_${ticket.id}`)
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`deny_${userId}_${ticket.id}`)
        .setLabel('Deny')
        .setStyle(ButtonStyle.Danger)
    );

    const ticketInitEmbed = new EmbedBuilder()
      .setTitle(ticket.name)
      .setColor(bot.config.COLORS.MAIN as ColorResolvable)
      .setDescription(`
        **Username:** ${interaction.user.tag}
        **Description:** \n${description}
      `)
      .setTimestamp();

    await ticketChannel.send({
      embeds: [ticketInitEmbed],
      components: [row]
    });

    await interaction.reply({
      content: 'Application has been sent! Please wait for a staff member to review it.',
      ephemeral: true
    });

    setTimeout(() => {
      interaction.deleteReply().catch((err) => console.log(err));
    }, 2000);

    return {
      success: true,
    };
  }
};

//  check if user has reached max ticket limit
export const maxTicketperUserReached = async (
  guild: Guild,
  username: string
): Promise<boolean> => {
  let i = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name === `ticket-${username.split('#').join('')}`) i++;
  }
  if (i >= bot.config.MAX_TICKET_PER_USER) {
    return true;
  } else {
    return false;
  }
};

//  check if ticket is already opened for this user in this category
export const isTicketAlreadyOpened = async (
  guild: Guild,
  username: string,
  ticketId: string
): Promise<boolean> => {
  console.log(`ticket-${username.split('#').join('')}`);

  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name === `ticket-${username.split('#').join('')}`) {
      
      const channelTicketId = channel.topic?.split('|')[3].trim();
      console.log(channelTicketId);
      if (channelTicketId === ticketId) {
        return true;
      }
    }
  }
  return false;
};

//  check if max tickets per category is reached
export const maxTicketPerCategoryReached = async (guild: Guild, ticketId: string) => {
  const maxTickets = bot.ticketData.find((ticket) => ticket.id === ticketId)?.maxTickets;
  let count = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name.startsWith('ticket-')) count++;
  }
  if (count === maxTickets ?? 0)
    return true;
  else return false;
};

//  check if max tickets per category is reached
export const maxTicketReached = async (guild: Guild) => {
  const maxTickets = bot.config.MAX_TICKETS
  let count = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name.startsWith('ticket-')) count++;
  }
  if (count === maxTickets ?? 0)
    return true;
  else return false;
};
