import { ButtonInteraction, GuildMember, TextChannel } from 'discord.js';
import { bot } from '../..';
import { ButtonHandler } from '../../types/handlers';
import { closeTicket } from '../../utils/ticket';

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

      const ticketId = topic.split('|')[3].trim();
      const ticket = bot.ticketData.find((ticket) => ticket.id === ticketId);
      if (ticket == null) {
        await interaction.reply('Could not find ticket! Please contact admin.');
        return;
      }

      if (ticket.type === 'CHAT') {
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
          content: 'Could not find member in server! Please contact admin.'
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

      if (ticket.type === 'APPLICATION' || ticket.type === 'TEST-APPLICATION') {
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
  }
};

export default buttonHandler;
