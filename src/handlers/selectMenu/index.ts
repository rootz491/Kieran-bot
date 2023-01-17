import { StringSelectMenuInteraction } from "discord.js";
import { TicketData } from "../../configs/ticket.dev";  //  TODO update this to prod
import { SelectMenuHandler } from "../../types/handlers";
import { TicketType } from "../../types/ticket";

const selectMenuHandler: SelectMenuHandler = {
    'test': async (interaction: StringSelectMenuInteraction) => {
        const value = interaction.values[0];
        await interaction.reply(`Test select menu used!\nSelected value: ${value}`);
    },

    'ticket': async (interaction: StringSelectMenuInteraction) => {
        const selectMenuId = interaction.customId;
        const value = interaction.values[0];
        const ticketType = selectMenuId.split('-').filter((_, i) => i != 0).join("-") as TicketType;

        const ticket = TicketData.find(ticket => ticket.type === ticketType && ticket.id === value);
        console.log(ticket);
        
        if (ticket) {
            //  TODO: Open ticket
        } else {
            await interaction.reply({
                content: `Ticket [${ticketType}] with id [${value}] not found`,
                ephemeral: true,
            });
        }
    }
}

export default selectMenuHandler;