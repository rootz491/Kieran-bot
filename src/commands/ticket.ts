import { ActionRowBuilder, ColorResolvable, CommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js';
import { bot } from '..';;

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sends a ticket menu for users to create a ticket'),
  async execute(interaction: CommandInteraction) {
    // build all ticket embeds from config
    const ticketMenuEmbeds = bot.ticketMenuData.map((t) => {
      return {
        type: t.type,
        embed: new EmbedBuilder()
        .setTitle(t.title)
        .setDescription(t.description)
        .setColor(t.embedColor as ColorResolvable ?? 'Random')
      };
    });

    // build all ticket select menus from config
    const ticketSelectMenus = bot.ticketMenuData.map((t) => {
      return {
        type: t.type,
        row: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`ticket-${t.type}`)
            .setPlaceholder('Select a ticket type')
            .addOptions(
              bot.ticketData.filter(ticket => ticket.type === t.type).map((ticket) => {
                return {
                  label: ticket.name,
                  value: ticket.id
                };
              })
            )
        )
      }
    });

    // send chat ticket menu
    const chatEmbed = ticketMenuEmbeds.find((t) => t.type === 'CHAT')?.embed;
    const chatRow = ticketSelectMenus.find((t) => t.type === 'CHAT')?.row;
    if (chatEmbed && chatRow) {
      await interaction.channel?.send({
        embeds: [chatEmbed],
        components: [chatRow]
      });
    }

    // send application ticket menu
    const applicationEmbed = ticketMenuEmbeds.find((t) => t.type === 'APPLICATION')?.embed;
    const applicationRow = ticketSelectMenus.find((t) => t.type === 'APPLICATION')?.row;
    if (applicationEmbed && applicationRow) {
      await interaction.channel?.send({
        embeds: [applicationEmbed],
        components: [applicationRow]
      });
    }

    // send test application ticket menu
    const testApplicationEmbed = ticketMenuEmbeds.find((t) => t.type === 'TEST-APPLICATION')?.embed;
    const testApplicationRow = ticketSelectMenus.find((t) => t.type === 'TEST-APPLICATION')?.row;
    if (testApplicationEmbed && testApplicationRow) {
      await interaction.channel?.send({
        embeds: [testApplicationEmbed],
        components: [testApplicationRow]
      });
    }

    interaction.reply({
      content: 'Ticket menu has been sent!',
      ephemeral: true
    });
  }
};
