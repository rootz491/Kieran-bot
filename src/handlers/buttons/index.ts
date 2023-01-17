import { ButtonInteraction, TextChannel } from "discord.js";
import { TicketData } from "../../configs/ticket.dev";
import { ButtonHandler } from "../../types/handlers";
import { closeTicket } from "../../utils/ticket";

const buttonHandler: ButtonHandler = {
    'test': async (interaction: ButtonInteraction) => {
        await interaction.reply('Test button clicked!');
    },

    'resolve': async (interaction: ButtonInteraction) => {
        await interaction.deferReply({
            ephemeral: true
        })

        const topic = (interaction.channel as TextChannel).topic;
        if (topic == null) {
            await interaction.reply('Could not find ticket topic! Please contact admin.');
            return;
        }
        
        const ticketId = topic.split('|')[3].trim();
        const ticket = TicketData.find(ticket => ticket.id === ticketId);
        if (ticket == null) {
            await interaction.reply('Could not find ticket! Please contact admin.');
            return;
        }

        const ticketRes = await closeTicket(interaction.channelId, 'Ticket resolved!', ticket.loggingChannel);
        if (ticketRes && ticketRes === true) {
            console.log('Ticket resolved!');
        } else {
            await interaction.editReply('Ticket could not be resolved! Please contact developer.');
        }
    }
};

export default buttonHandler;