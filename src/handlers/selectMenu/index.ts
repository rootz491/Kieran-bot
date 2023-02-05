import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputComponent,
  TextInputStyle
} from 'discord.js';
import { bot } from '../..';
import { SelectMenuHandler } from '../../types/handlers';
import { TicketType } from '../../types/ticket';
import {
  createTicket,
  maxTicketperUserReached,
  isTicketAlreadyOpened,
  maxTicketReached,
  maxTicketPerCategoryReached
} from '../../utils/ticket/create';

const selectMenuHandler: SelectMenuHandler = {
  test: async (interaction: StringSelectMenuInteraction) => {
    const value = interaction.values[0];
    await interaction.reply(`Test select menu used!\nSelected value: ${value}`);
  }
};

export default selectMenuHandler;
