import { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { bot } from "../..";
import { ButtonHandler } from "../../types/handlers";
import { closeTicket } from "../../utils/ticket";

const buttonHandler: ButtonHandler = {
    'test': async (interaction: ButtonInteraction) => {
        await interaction.reply('Test button clicked!');
    },

    'resolve': async (interaction: ButtonInteraction) => {
        try {
            // check role if user is admin or staff
            if (
                (interaction.member as GuildMember).roles.cache.find(
                    (role) => role.id === bot.config.ROLES.ADMIN_ROLE_ID || role.id === bot.config.ROLES.STAFF_ROLE_ID
                ) == null
            ) {
                await interaction.reply('You do not have permission to resolve this ticket!');
                return;
            }

            await interaction.deferReply({
                ephemeral: true
            })
    
            const topic = (interaction.channel as TextChannel).topic;
            if (topic == null) {
                await interaction.reply('Could not find ticket topic! Please contact admin.');
                return;
            }
            
            const ticketId = topic.split('|')[3].trim();
            const ticket = bot.ticketData.find(ticket => ticket.id === ticketId);
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
        } catch (error) {
            console.log(error);
        }
    },

    'accept-deny': async (interaction: ButtonInteraction) => {
        try {
            interaction.deferReply({
                ephemeral: true
            })

            const userId = interaction.customId.split('_')[1];
            const member = interaction.guild?.members.cache.get(userId);
            if (member == null) {
                await interaction.reply({
                    content: 'Could not find member in server! Please contact admin.',
                    ephemeral: true
                });
                return;
            }

            const ticketId = interaction.customId.split('_')[2];
            const ticket = bot.ticketData.find(ticket => ticket.id === ticketId);
            if (ticket == null) {
                await interaction.reply({
                    content: 'Could not find ticket! Please contact admin.',
                    ephemeral: true
                });
                return;
            }

            if (ticket.type === 'APPLICATION' || ticket.type === 'TEST-APPLICATION') {
                if (interaction.customId.startsWith('accept')) {
                    await member.send({
                        content: ticket.acceptMessage
                    })
                } else if (interaction.customId.startsWith('deny')) {
                    await member.send({
                        content: ticket.declineMessage
                    })
                }

                // remove application from application-channel and add to application-logging-channel
                const applicationEmbed = interaction.message.embeds[0];
                const loggingChannel = (await bot.getManagementGuild()).channels.cache.get(ticket.loggingChannel) as TextChannel;
                await loggingChannel.send({
                    embeds: [applicationEmbed],
                    content: `Application by ${member.user.tag} has been ${interaction.customId.startsWith('accept') ? '**accepted**' : '**denied**'}!`
                });
                await interaction.message.delete();

                interaction.editReply({
                    content: 'Application has been processed! Member has been notified.'
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default buttonHandler;