import { ActionRowBuilder, ColorResolvable, EmbedBuilder, ModalBuilder, TextInputBuilder } from 'discord.js';
import { ButtonInteraction, GuildMember, TextChannel } from 'discord.js';
import { bot } from '../..';
import { ButtonHandler } from '../../types/handlers';
import { TicketFormData } from '../../types/ticket';
import { closeTicket } from '../../utils/ticket';
import {
  createTicket,
  isTicketAlreadyOpened,
  maxTicketPerCategoryReached,
  maxTicketperUserReached,
  maxTicketReached
} from '../../utils/ticket/create';

const buttonHandler: ButtonHandler = {
  test: async (interaction: ButtonInteraction) => {
    await interaction.reply('Test button clicked!');
  },

  resolve: async (interaction: ButtonInteraction) => {
    try {
      // check role if user is admin or staff
      if (
        (interaction.member as GuildMember).roles.cache.find(
          (role) =>
            role.id === bot.config.ROLES.ADMIN_ROLE_ID ||
            role.id === bot.config.ROLES.STAFF_ROLE_ID
        ) == null
      ) {
        await interaction.reply(
          'You do not have permission to resolve this ticket!'
        );
        return;
      }

      await interaction.deferReply({
        ephemeral: true
      });

      const topic = (interaction.channel as TextChannel).topic;
      if (topic == null) {
        await interaction.reply(
          'Could not find ticket topic! Please contact admin.'
        );
        return;
      }

      const ticketCreatorUserId = topic.split('|')[1].trim();
      const ticketCreator = (await bot.getMainGuild())?.members.cache.get(
        ticketCreatorUserId
      );
      if (ticketCreator == null) {
        await interaction.editReply(
          'Could not find ticket creator! Please contact admin.'
        );
        return;
      }

      const ticketId = topic.split('|')[3].trim();
      const ticket = bot.ticketData.find((ticket) => ticket.id === ticketId);
      if (ticket == null) {
        await interaction.reply('Could not find ticket! Please contact admin.');
        return;
      }

      if (ticket.type === 'CHAT' || ticket.type === 'COMBINED') {

        if (ticket.type === 'COMBINED') {
          // fetch oldest message in channel
          const firstMessage = (await interaction.channel?.messages.fetch())?.reverse().first();
          const firstMessageEmbed = firstMessage?.embeds[0];

          if (firstMessageEmbed == null) {
            await interaction.editReply(
              'Could not find ticket embed! Therefore, could not create application for this ticket.\nPlease contact developer.'
            );
            return;
          } else {

            const keyData = firstMessageEmbed.description?.split('\n')
              .filter((_, index) => index !== 0)
              .filter((field) => field !== '')
              .filter((field) => field.startsWith('**'));
            const valueData = firstMessageEmbed.description?.split('\n')
              .filter((_, index) => index !== 0)
              .filter((field) => field !== '')
              .filter((field) => !field.startsWith('**'));
            
            const ticketFormData: TicketFormData[] = [];
            keyData?.forEach((key, index) => {
              ticketFormData.push({
                id: key.replace('**', '').replace('**', '').replace(':', '').trim(),
                text: valueData?.[index] as string
              });
            });

            // TODO create application for this ticket
            createTicket(
              interaction,
              ticketFormData,
              ticket,
              ticketCreatorUserId,
              true
            )
          }
        }

        const ticketRes = await closeTicket(
          interaction.channelId,
          ticket.loggingChannel,
          interaction.user.id
        );

        if (ticketRes && ticketRes === true) {
          console.log('Ticket resolved!');
        } else {
          await interaction.editReply(
            'Ticket could not be resolved! Please contact developer.'
          );
        }

        if (ticket.ticketClosingMessage.enabled === true) {
          await ticketCreator.send({
            embeds: [
              new EmbedBuilder()
                .setTitle(ticket.ticketClosingMessage.title)
                .setDescription(
                  ticket.ticketClosingMessage.description
                )
            ]
          });
        }

      } else {
        await interaction.editReply(
          `This button [${interaction.customId}] is not available for this ticket type!`
        );
      }
    } catch (error) {
      console.log(error);
    }
  },

  'accept-deny': async (interaction: ButtonInteraction) => {
    try {
      await interaction.deferReply({
        ephemeral: true
      });

      const userId = interaction.customId.split('_')[1].trim();
      const member = (await bot.getMainGuild())?.members.cache.get(userId);

      if (member == null) {
        await interaction.editReply({
          content: 'Could not find member in "MAIN" server! Please contact admin.'
        });
        return;
      }

      const ticketId = interaction.customId.split('_')[2];
      const ticket = bot.ticketData.find((ticket) => ticket.id === ticketId);
      if (ticket == null) {
        await interaction.editReply({
          content: 'Could not find ticket! Please contact admin.'
        });
        return;
      }

      if (ticket.type === 'APPLICATION' || ticket.type === 'TEST-APPLICATION' || ticket.type === 'COMBINED') {
        if (interaction.customId.startsWith('accept')) {
          await member.send({
            content: ticket.acceptMessage
          });
        } else if (interaction.customId.startsWith('deny')) {
          await member.send({
            content: ticket.declineMessage
          });
        }

        await interaction.message.edit({
          content: `Application has been ${
            interaction.customId.startsWith('accept')
              ? '**Accepted**'
              : '**Denied**'
          } by ${interaction.user}!`,
          components: []
        });

        await interaction.editReply({
          content: 'Application has been processed! Member has been notified.'
        });

        setTimeout(async () => {
          await interaction.deleteReply();
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  },

  ticket: async (interaction: ButtonInteraction) => {
    try {
      const id = interaction.customId;
      const ticketId = id
        .split('-')
        .filter((_, i) => i != 0)
        .join('-') as string;

      const ticket = bot.ticketData.find((ticket) => ticket.id === ticketId);

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
            ticket.fields.map((field) => {
              return new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setCustomId(field.id)
                  .setLabel(field.name)
                  .setPlaceholder(field.placeholder)
                  .setStyle(field.type)
                  .setMinLength(field.minLength)
                  .setMaxLength(field.maxLength)
                  .setRequired(field.required)
              );
            })
          );

        await interaction.showModal(modal);

        const submittedInteraction = await interaction
          .awaitModalSubmit({
            time: 10 * 60000, // 10 minutes
            filter: (k: any) => k.user.id === interaction.user.id
          })
          .catch((error: any) => {
            console.error(error);
            return null;
          });

        //  handle collector end event
        if (submittedInteraction) {
          const fields = ticket.fields.map((field) => field.id);
          const ticketData: TicketFormData[] = fields.map((field) => {
            return {
              id: field,
              text: submittedInteraction.fields.getTextInputValue(field)
            };
          });
          // submittedInteraction.fields.getTextInputValue('description');

          const ticketRes = await createTicket(
            submittedInteraction,
            ticketData,
            ticket,
            interaction.user.id,
            false
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
          content: `Ticket [${ticketId}] not found`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default buttonHandler;
