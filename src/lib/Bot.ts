import { Client, Collection } from 'discord.js';
import { join } from 'path';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../configs/config.dev';
import { TicketData, TicketMenuData } from '../configs/ticket.dev';
import { CommandData } from '../configs/command';

export default class Bot {
  public commands = new Collection<string, any>();
  private commandsRegisterArray: any[] = [];

  public config = config;
  public ticketData = TicketData;
  public ticketMenuData = TicketMenuData;
  public commandData = CommandData;

  constructor(public readonly client: Client) {
    this.client.login(config.TOKEN);

    this.client.on('warn', (info) => console.log(info));
    this.client.on('error', console.error);

    this.importEvents();
    this.importSlashCommands();
    this.registerCommand();
  }

  private async importEvents() {
    const eventFiles = fs
      .readdirSync(join(__dirname, '../events'))
      .filter((file) => !file.endsWith('.map'));

    for (const file of eventFiles) {
      const filePath = join(join(__dirname, '../events'), file);
      const event = await import(filePath);

      const currentEvent = event.default;

      if (currentEvent.once) {
        this.client.once(currentEvent.name, (...args) =>
          currentEvent.execute(...args)
        );
      } else {
        this.client.on(currentEvent.name, (...args) =>
          currentEvent.execute(...args)
        );
      }
    }
  }

  private async importSlashCommands() {
    const commandFiles = fs
      .readdirSync(join(__dirname, '../commands'))
      .filter((file) => !file.endsWith('.map'));

    for (const file of commandFiles) {
      const filePath = join(join(__dirname, '../commands'), file);
      const command = await import(filePath);
      const currentCommand = command.default;

      this.commands.set(currentCommand.data.name, currentCommand);
      console.log(`Loaded command ${currentCommand.data.name}`);

      const commandData = currentCommand.data.toJSON();
      this.commandsRegisterArray.push(commandData);
    }
  }

  private async registerCommand() {
    setTimeout(() => {
      const rest = new REST({ version: '9' }).setToken(config.TOKEN);
      rest
        .put(
          Routes.applicationGuildCommands(
            config.CLIENT_ID,
            config.GUILDS.MAIN_GUILD_ID
          ),
          { body: this.commandsRegisterArray }
        )
        .then(() =>
          console.log('Successfully registered application commands!')
        )
        .catch(console.error);
    }, 2500);
  }

  public async getManagementGuild() {
    const guild = await this.client.guilds.fetch(
      config.GUILDS.MANAGEMENT_GUILD_ID
    );
    return guild;
  }

  public async getMainGuild() {
    const guild = await this.client.guilds.fetch(config.GUILDS.MAIN_GUILD_ID);
    return guild;
  }
}
