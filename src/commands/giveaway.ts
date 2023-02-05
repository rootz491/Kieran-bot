// /giveaway start {NAME/Description} {Prize/Reward} {Number of Winners} {Length in d/h/s (Days, Hours, Seconds)}

import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';
import giveawayHandler from '../utils/giveawayHandler';

export default {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Create a giveaway')
    // .addStringOption(option =>
    // 	option.setName('name')
    // 		.setDescription('Name of the giveaway'))

    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of the giveaway')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('prize')
        .setDescription('Prize of the giveaway')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('winners')
        .setDescription('Number of winners of the giveaway')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('ends')
        .setDescription('Length of the giveaway in day/hour/second')
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    try {
      // @ts-ignore
      const name = interaction.options.getString('name') ?? 'No name provided';
      const prize =
        // @ts-ignore
        interaction.options.getString('prize') ?? 'No prize provided';
      // @ts-ignore
      const winners = interaction.options.getInteger('winners') ?? 1;
      const length =
        // @ts-ignore
        interaction.options.getString('ends') ?? 'No length provided';

      if (length.split('/').length !== 3) {
        await interaction.reply({
          content:
            'Invalid length format. Please use d/h/s (Days, Hours, Seconds).',
          ephemeral: true
        });
        return;
      } else {
        const time = length.split('/');
        const days = Number(time[0]);
        const hours = Number(time[1]);
        const seconds = Number(time[2]);

        if (isNaN(days) || isNaN(hours) || isNaN(seconds)) {
          await interaction.reply({
            content:
              'Invalid length format. Please use d/h/s (Days, Hours, Seconds).',
            ephemeral: true
          });
          return;
        }
      }

      const time = length.split('/');
      const days = Number(time[0]);
      const hours = Number(time[1]);
      const seconds = Number(time[2]);

      const timeInMs = days * 86400000 + hours * 3600000 + seconds * 1000;

      //  get the current time in ms and add the time in ms to it
      const end = new Date(new Date().getTime() + timeInMs / 1000);
      const endMs = end.getTime();

      const embed = new EmbedBuilder()
        .setTitle(name)
        .setDescription(
          `Prize: ${prize}\nWinners: ${winners}\nHosted by: ${
            interaction.user
          }\nEnds in <t:${Math.floor(
            endMs / 1000
          )}:f>\n\nReact with 🎉 to enter!`
        )
        .setTimestamp();

      const msg = await interaction.channel?.send({
        embeds: [embed]
      });

      await interaction.reply({
        content: 'Embed sent!',
        ephemeral: true
      });

      if (msg) {
        await msg.react('🎉');
        await giveawayHandler(msg, length, winners);
      }

      setTimeout(() => {
        interaction.deleteReply();
      }, 4000);
      return;
    } catch (error) {
      console.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: 'An error occurred while executing this command.'
        });
      } else {
        await interaction.reply({
          content: 'An error occurred while executing this command.',
          ephemeral: true
        });
      }
    }
  }
};
