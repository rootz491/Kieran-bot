import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';
import { bot } from '..';

interface TicketButtons {
  type: string;
  buttons: ButtonBuilder[];
}

type TicketRows = ActionRowBuilder<ButtonBuilder>[];

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sends a ticket menu for users to create a ticket'),
  async execute(interaction: CommandInteraction) {
    try {
      // build all ticket embeds from config
      const ticketMenuEmbeds = bot.ticketMenuData.map((t) => {
        return {
          type: t.type,
          embed: new EmbedBuilder()
            .setTitle(t.title)
            .setDescription(t.description)
            .setColor((t.embedColor as ColorResolvable) ?? 'Random')
        };
      });

      // build all ticket select menus from config
      const ticketButtons = bot.ticketMenuData.map((t) => {
        const buttons = bot.ticketData
          .filter((ticket) => {
            if (ticket.type === t.type)
              return ticket;
            else if (t.type === 'APPLICATION' && ticket.type === 'COMBINED')
              return ticket;
          })
          .map((ticket) => {
            return new ButtonBuilder()
              .setCustomId(`ticket-${ticket.id}`)
              .setLabel(ticket.name)
              .setStyle(ButtonStyle.Primary);
          });
        return {
          type: t.type,
          buttons: buttons
        };
      });

      bot.ticketMenuData
        .map((t) => t.type)
        .map(async (type) => {
          const embed = ticketMenuEmbeds.find((t) => t.type === type)?.embed;
          const rows: TicketRows = ticketButtonRowPerCategory(
            type,
            ticketButtons
          );
          if (embed && rows) {
            await interaction.channel?.send({
              embeds: [embed],
              components: [...rows]
            });
          }
        });

      interaction.reply({
        content: 'Ticket menu has been sent!',
        ephemeral: true
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const ticketButtonRowPerCategory = (
  category: string,
  ticketButtons: TicketButtons[]
): TicketRows => {
  try {
    const chatRows: TicketRows = [];

    let chatRowIndex = 0;
    let buttonCount = 0;

    const totalButtons =
      ticketButtons.find((t) => t.type === category)?.buttons.length ?? 0;
    const totalRows = Math.ceil(totalButtons / 5);

    // each row should contain equal amount of buttons, max 5 buttons per row & 5 rows max
    const buttonPerRow = Math.ceil(totalButtons / totalRows);

    // for every 5 buttons, create a new row
    ticketButtons
      .find((t) => t.type === category)
      ?.buttons.forEach((button: ButtonBuilder) => {
        if (buttonCount % buttonPerRow === 0) {
          chatRows[chatRowIndex] =
            new ActionRowBuilder<ButtonBuilder>().addComponents(button);
          chatRowIndex++;
        } else {
          chatRows[chatRowIndex - 1].addComponents(button);
        }
        buttonCount++;
      });

    return chatRows;
  } catch (error) {
    console.log(error);
    return [];
  }
};
