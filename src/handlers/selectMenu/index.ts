import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputComponent,
  TextInputStyle
} from 'discord.js';
import { bot } from '../..';
import { SelectMenuHandler } from '../../types/handlers';
import { TicketType } from '../../types/ticket';
import {
  createTicket,
  maxTicketperUserReached,
  isTicketAlreadyOpened,
  maxTicketReached,
  maxTicketPerCategoryReached
} from '../../utils/ticket/create';

const selectMenuHandler: SelectMenuHandler = {
  test: async (interaction: StringSelectMenuInteraction) => {
    const value = interaction.values[0];
    await interaction.reply(`Test select menu used!\nSelected value: ${value}`);
  },

  ticket: async (interaction: StringSelectMenuInteraction) => {
    try {
      const selectMenuId = interaction.customId;
      const value = interaction.values[0];
      const ticketType = selectMenuId
        .split('-')
        .filter((_, i) => i != 0)
        .join('-') as TicketType;

      const ticket = bot.ticketData.find(
        (ticket) => ticket.type === ticketType && ticket.id === value
      );

      if (ticket) {
        //  ticket check only applies to CHAT tickets
        if (ticket.type === 'CHAT') {
          //  check if max tickets reached
          if ((await maxTicketReached(await bot.getMainGuild())) === true) {
            await interaction.reply({
              content:
                'Maximum amount of tickets reached. Please try again later.',
              ephemeral: true
            });
            return;
          }

          //  check if user has already created a ticket of this type max number of times
          if (
            (await maxTicketPerCategoryReached(
              await bot.getMainGuild(),
              ticket.id
            )) === true
          ) {
            await interaction.reply({
              content:
                'Maximum amount of tickets of this type reached. Please try again in .',
              ephemeral: true
            });
            return;
          }

          //  check max tickets per user
          if (
            (await maxTicketperUserReached(
              await bot.getMainGuild(),
              interaction.user.tag
            )) === true
          ) {
            await interaction.reply({
              content: `You have reached the maximum amount of tickets you can create (${bot.config.MAX_TICKET_PER_USER})\nPlease close one of your tickets before creating a new one.`,
              ephemeral: true
            });
            return;
          }

          //  check if ticket is already opened for this user in this category
          if (
            (await isTicketAlreadyOpened(
              await bot.getMainGuild(),
              interaction.user.tag,
              ticket.id
            )) === true
          ) {
            await interaction.reply({
              content:
                'You already have a ticket of this type open. Please close it before creating a new one.',
              ephemeral: true
            });
            return;
          }
        }

        const modal = new ModalBuilder()
          .setCustomId('ticket-description')
          .setTitle(ticket.name)
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Description')
                .setPlaceholder('Please enter a description for your ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)
                .setMaxLength(100)
                .setRequired(true)
            )
          );

        await interaction.showModal(modal);

        const submittedInteraction = await interaction
          .awaitModalSubmit({
            time: 60000,
            filter: (k: any) => k.user.id === interaction.user.id
          })
          .catch((error: any) => {
            console.error(error);
            return null;
          });

        //  handle collector end event
        if (submittedInteraction) {
          const ticketDescription =
            submittedInteraction.fields.getTextInputValue('description');

          const ticketRes = await createTicket(
            submittedInteraction,
            ticketDescription,
            ticket,
            interaction.user.id
          );

          if (ticketRes && ticketRes.success) {
            console.log('Ticket created successfully');
          } else {
            await interaction.reply({
              content: `Ticket creation failed: ${JSON.stringify(
                ticketRes ?? { error: 'Unknown error' }
              )}`,
              ephemeral: true
            });
          }
        }
      } else {
        await interaction.reply({
          content: `Ticket [${ticketType}] with id [${value}] not found`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default selectMenuHandler;
