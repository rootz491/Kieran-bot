import { ButtonInteraction } from "discord.js";
import { ButtonHandler } from "../../types/handlers";

const buttonHandler: ButtonHandler = {
    'test': async (interaction: ButtonInteraction) => {
        await interaction.reply('Test button clicked!');
    }
};

export default buttonHandler;