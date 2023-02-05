import { TextInputStyle } from 'discord.js';

export type Ticket = ChatTicket | ApplicationTicket;

interface BaseTicket {
  id: string;
  name: string;
  type: TicketType;

  fields: {
    id: string;
    name: string;
    placeholder: string;
    type: TextInputStyle;
    minLength: number;
    maxLength: number;
    required: boolean;
  }[];
}

interface ChatTicket extends BaseTicket {
  type: 'CHAT';
  categoryId: string;
  description: string;
  ticketClosingMessage: TicketClosingMessage;
  loggingChannel: string;
  maxTickets: number;
}

interface ApplicationTicket extends BaseTicket {
  type: 'APPLICATION' | 'TEST-APPLICATION';
  channelId: string;
  acceptMessage: string;
  declineMessage: string;
}

export type TicketType = 'CHAT' | 'APPLICATION' | 'TEST-APPLICATION';

type TicketClosingMessage =
  | TicketClosingMessageEnabled
  | TicketClosingMessageDisabled;

interface TicketClosingMessageEnabled {
  enabled: true;
  title: string;
  description: string;
}

interface TicketClosingMessageDisabled {
  enabled: false;
}

export interface TicketMenu {
  type: TicketType;
  title: string;
  description: string;
  embedColor?: string;
}

export interface TicketFormData {
  id: string;
  text: string;
}
