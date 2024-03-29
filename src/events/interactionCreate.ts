import { CommandInteraction, Events, Interaction } from 'discord.js';
import { bot } from '..';
import buttonHandler from '../handlers/buttons';
import modalHandler from '../handlers/modals';
import selectMenuHandler from '../handlers/selectMenu';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    try {
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
        const buttonId = interaction.customId;
        // ticket select menu
        if (buttonId.startsWith('ticket-')) {
          buttonHandler['ticket'](interaction);
        } else if (buttonId.startsWith('resolve-')) {
          buttonHandler['resolve'](interaction);
        } else if (
          buttonId.startsWith('accept_') ||
          buttonId.startsWith('deny_')
        ) {
          buttonHandler['accept-deny'](interaction);
        } else {
          const handler = buttonHandler[buttonId];
          if (handler != null) {
            handler(interaction);
          } else {
            console.log(`button [${buttonId}] is not yet implemented`);
          }
        }
      }

      //  Handle modal submissions
      if (interaction.isModalSubmit()) {
        const member = interaction.member;
        if (!member) return;
        const modalId = interaction.customId;
        const handler = modalHandler[modalId];
        if (handler != null) {
          handler(interaction);
        } else {
          console.log(`modal [${modalId}] is not yet implemented`);
        }
      }

      //  Handle select menus
      if (interaction.isStringSelectMenu()) {
        const member = interaction.member;
        if (!member) return;
        const selectMenuId = interaction.customId;
        // basic select menu
        const handler = selectMenuHandler[selectMenuId];
        if (handler != null) handler(interaction);
        else
          interaction.reply({
            content: `select menu [${selectMenuId}] is not yet implemented`,
            ephemeral: true
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
