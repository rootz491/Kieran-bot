export interface Ticket {
  id: string;
  name: string;
  type: TicketType;
  categoryId?: string;
  channelId?: string;
  loggingChannel: string;
  description: string;
}

export type TicketType = 'CHAT' | 'APPLICATION';
