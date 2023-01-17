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
  ChannelType
} from 'discord.js';
import config from '../../configs/config';
import { TicketData } from '../../configs/ticket.dev';
import { Ticket } from '../../types/ticket';

export const createTicket = async (
  interaction: ModalSubmitInteraction,
  description: string,
  ticket: Ticket
) => {
  if (ticket.type === 'CHAT') {
    //  create a channel, add admin, staff & user
    const ticketChannel = await interaction.guild!.channels.create({
      name: `ticket-${interaction.user.tag}`,
      parent: ticket.categoryId, //  TODO fetch from config later
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
          id: config.ROLES.ADMIN_ROLE_ID,
          type: OverwriteType.Role,
          allow: [PermissionsBitField.All]
        },
        {
          id: config.ROLES.STAFF_ROLE_ID,
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
      .setColor(config.COLORS.SUCCESS as ColorResolvable)
      .setDescription(
        `Hey, ${interaction.user}. Your ticket has been created: ${ticketChannel}`
      );
  
    const ticketInitEmbed = new EmbedBuilder()
      .setTitle('Ticket')
      .setColor(config.COLORS.MAIN as ColorResolvable)
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
    interaction.reply({
      embeds: [confirmationEmbed],
      components: [linkRow],
      ephemeral: true
    });

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
        .setCustomId(`accept-${ticketChannel.id}-${ticket.id}`)
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`deny-${ticketChannel.id}-${ticket.id}`)
        .setLabel('Deny')
        .setStyle(ButtonStyle.Danger)
    );

    const ticketInitEmbed = new EmbedBuilder()
      .setTitle(ticket.name)
      .setColor(config.COLORS.MAIN as ColorResolvable)
      .setDescription(`
        **Username:** ${interaction.user.tag}
        **Description:** \n${description}
      `);

    await ticketChannel.send({
      embeds: [ticketInitEmbed],
      components: [row]
    });

    interaction.reply({
      content: 'Application has been sent! Please wait for a staff member to review it.',
      ephemeral: true
    });

    return {
      success: true,
    };
  }
};

export const getOpenedTicketNumber = async (
  guild: Guild,
  username: string
): Promise<number> => {
  let i = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name === `ticket-${username.split('#').join('')}`) i++;
  }
  return i;
};

export const maxTicketReached = async (guild: Guild, ticketId: string) => {
  const maxTickets = TicketData.find((ticket) => ticket.id === ticketId)?.maxTickets;
  let count = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name.startsWith('order-')) count++;
  }
  if (count === maxTickets ?? 0)
    return true;
  else return false;
};
