import {
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  ModalActionRowComponentBuilder
} from 'discord.js';
import { bot } from '..';
import config from '../configs/config';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: Interaction) {
    //  Handle slash commands
    if (interaction.isCommand()) {
      bot.commands
        .get(interaction.commandName)
        ?.execute(interaction as CommandInteraction);
    }

    //  Handle button clicks
    if (interaction.isButton()) {
      const member = interaction.member;
      if (!member) return;

      switch (interaction.customId) {
        case 'closeTicket': {
          //  TODO call the closeTicket function from utils/ticket/index.ts
          break;
        }

        case `request-resolve-${interaction.channelId}`: {
          try {
            if (
              !interaction.guild?.members?.me?.permissions?.has(
                PermissionsBitField.Flags.Administrator
              )
            ) {
              await interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('Permission denied!')
                    .setColor(config.COLORS.ERROR as ColorResolvable)
                ],
                ephemeral: true
              });
              break;
            }

            const resolveModal = new ModalBuilder()
              .setCustomId(`resolve-${interaction.channelId}`)
              .setTitle('Enter Reason Of Resolution');
            const reason = new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Reason')
              .setPlaceholder('Enter reason....')
              .setStyle(TextInputStyle.Paragraph)
              .setMaxLength(150)
              .setMinLength(10)
              .setRequired(true);
            resolveModal.addComponents(
              new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                reason
              )
            );
            interaction.showModal(resolveModal);
          } catch (error: any) {
            console.log(error);
            interaction.reply({ content: 'internal error', ephemeral: true });
          }
          break;
        }
      }
    }
  }
};
