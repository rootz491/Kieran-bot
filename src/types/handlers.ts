import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction
} from 'discord.js';

export type ButtonHandler = {
  [key: string]: (interaction: ButtonInteraction) => Promise<void>;
};

export type ModalHandler = {
  [key: string]: (interaction: ModalSubmitInteraction) => Promise<void>;
};

export type SelectMenuHandler = {
  [key: string]: (interaction: StringSelectMenuInteraction) => Promise<void>;
};
