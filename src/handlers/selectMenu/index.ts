import { ActionRowBuilder, ModalBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { bot } from "../..";
import { SelectMenuHandler } from "../../types/handlers";
import { TicketType } from "../../types/ticket";
import { createTicket } from "../../utils/ticket/create";

const selectMenuHandler: SelectMenuHandler = {
    'test': async (interaction: StringSelectMenuInteraction) => {
        const value = interaction.values[0];
        await interaction.reply(`Test select menu used!\nSelected value: ${value}`);
    },

    'ticket': async (interaction: StringSelectMenuInteraction) => {
        const selectMenuId = interaction.customId;
        const value = interaction.values[0];
        const ticketType = selectMenuId.split('-').filter((_, i) => i != 0).join("-") as TicketType;

        const ticket = bot.ticketData.find(ticket => ticket.type === ticketType && ticket.id === value);
        
        if (ticket) {
            const modal = new ModalBuilder()
                .setCustomId("ticket-description")
                .setTitle(ticket.name)
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("description")
                                .setLabel("Description")
                                .setPlaceholder("Please enter a description for your ticket")
                                .setStyle(TextInputStyle.Paragraph)
                                .setMinLength(1)
                                .setMaxLength(100)
                                .setRequired(true),
                        )
            )

        await interaction.showModal(modal);

        const submittedInteraction = await interaction.awaitModalSubmit({
            time: 60000,
            filter: (k: any) => k.user.id === interaction.user.id,
        }).catch((error: any) => {
            console.error(error)
            return null
        })

            if (submittedInteraction) {
                const ticketDescription = submittedInteraction.fields.getTextInputValue("description");
                console.log(ticketDescription);
                const ticketRes = await createTicket(
                    submittedInteraction,
                    ticketDescription,
                    ticket,
                    interaction.user.id
                );

                if (ticketRes && ticketRes.success) {
                    console.log("Ticket created successfully");
                } else {
                    await interaction.reply({
                        content: `Ticket creation failed: ${JSON.stringify(ticketRes ?? { error: "Unknown error" })}`,
                        ephemeral: true,
                    });
                }
            }
        } else {
            await interaction.reply({
                content: `Ticket [${ticketType}] with id [${value}] not found`,
                ephemeral: true,
            });
        }
    }
}

export default selectMenuHandler;