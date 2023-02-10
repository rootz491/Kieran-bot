import { TextInputStyle } from 'discord.js';

export type Ticket = ChatTicket | ApplicationTicket | CombinedTicket;

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

interface CombinedTicket extends BaseTicket {
  type: 'COMBINED';
  categoryId: string;
  description: string;
  ticketClosingMessage: TicketClosingMessage;
  loggingChannel: string;
  maxTickets: number;
  channelId: string;
  acceptMessage: string;
  declineMessage: string;
}

export type TicketType = 'CHAT' | 'APPLICATION' | 'TEST-APPLICATION' | 'COMBINED';

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
