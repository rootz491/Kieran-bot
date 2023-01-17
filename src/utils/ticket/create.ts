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
  PermissionFlagsBits
} from 'discord.js';
import config from '../../configs/config';
import { Ticket } from '../../types/ticket';

export const createTicket = async (
  description: string,
  interaction: ModalSubmitInteraction,
  ticket: Ticket
) => {
  //  create a channel, add admin, staff & user
  const ticketChannel = await interaction.guild!.channels.create({
    name: `order-${interaction.user.tag}`,
    parent: '', //  TODO fetch from config later
    reason: `${interaction.user.tag} (${interaction.user.id}) made a ticket.`,
    topic: `${interaction.user.tag}'s ticket | ${interaction.user.id}`,
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
      .setCustomId(`request-resolve-${ticketChannel.id}`) //  TODO maybe update this based on ticket type
      .setLabel('Resolve Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  const confirmationEmbed = new EmbedBuilder()
    .setTitle('Order Request')
    .setDescription(
      `Hey, ${interaction.user}. Your ticket has been created: ${ticketChannel}`
    )
    .setColor('#3459d3');

  const ticketInitEmbed = new EmbedBuilder()
    .setTitle('Order Ticket')
    .setColor('#3459d3')
    .setDescription(
      //  TODO update this to config based on ticket type
      '**Description:** \n' + description
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
  return true;
};

export const hasMaxOpenedTicket = async (
  guild: Guild,
  username: string
): Promise<number> => {
  let i = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name === `support-${username.split('#').join('')}`) i++; //  TODO update this to config based on ticket type
  }
  return i;
};

export const maxCommissionTicketReached = async (guild: Guild) => {
  let count = 0;
  for (let channel of guild.channels.cache.values()) {
    channel = channel as TextChannel;
    if (channel.name.startsWith('order-')) count++;
  }
  if (count === 100)
    return true; //  TODO add config for MAX TICKETS on each category
  else return false;
};
