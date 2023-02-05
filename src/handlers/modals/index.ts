import { ModalSubmitInteraction } from 'discord.js';
import { ModalHandler } from '../../types/handlers';

const modalHandler: ModalHandler = {
  test: async (interaction: ModalSubmitInteraction) => {
    await interaction.reply('Test modal submitted!');
  }
};

export default modalHandler;
