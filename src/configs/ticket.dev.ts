import { TextInputStyle } from 'discord.js';
import { Ticket, TicketMenu } from '../types/ticket';

export const TicketData: Ticket[] = [
  //  Chat Tickets
  {
    id: 'claim-reward',
    name: 'Claim a Reward',
    type: 'CHAT',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: true,
      title: 'Ticket Closed',
      description:
        'Your ticket has been closed. If you have any further questions, please open a new ticket.'
    },
    maxTickets: 20,
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      },
      {
        id: 'name',
        name: 'What is your name?',
        placeholder: 'Please enter your name.',
        type: TextInputStyle.Short,
        minLength: 1,
        maxLength: 20,
        required: true
      }
    ]
  },
  {
    id: 'contact-admin',
    name: 'Contact an Admin',
    type: 'CHAT',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: false
    },
    maxTickets: 20,
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      }
    ]
  },
  {
    id: 'report-bug',
    name: 'Report a Bug',
    type: 'CHAT',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: false
    },
    maxTickets: 20,
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      }
    ]
  },
  {
    id: 'report-player',
    name: 'Report a Player ',
    type: 'CHAT',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: false
    },
    maxTickets: 20,
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      }
    ]
  },
  {
    id: 'appeal-punishment',
    name: 'Appeal a Punishment',
    type: 'CHAT',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: false
    },
    maxTickets: 20,
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      }
    ]
  },
  {
    id: 'other-inquiries',
    name: 'Other Inquiries',
    type: 'CHAT',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: false
    },
    maxTickets: 20,
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      },
      {
        id: 'name',
        name: 'What is your name?',
        placeholder: 'Please enter your name.',
        type: TextInputStyle.Short,
        minLength: 1,
        maxLength: 20,
        required: true
      }
    ]
  },
  //  Application Tickets
  {
    id: 'apply-for-staff',
    name: 'Apply for Staff',
    type: 'APPLICATION',
    channelId: '1065267606552051812',
    acceptMessage:
      'Thank you for your application, we will be in touch shortly.',
    declineMessage:
      'Thank you for your application, unfortunately we are not looking for any more staff at this time.',
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      },
      {
        id: 'name',
        name: 'What is your name?',
        placeholder: 'Please enter your name.',
        type: TextInputStyle.Short,
        minLength: 1,
        maxLength: 20,
        required: true
      }
    ]
  },
  {
    id: 'apply-for-builder',
    name: 'Apply for Builder',
    type: 'APPLICATION',
    channelId: '1065267606552051812',
    acceptMessage:
      'Thank you for your application, we will be in touch shortly.',
    declineMessage:
      'Thank you for your application, unfortunately we are not looking for any more builders at this time.',
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      },
      {
        id: 'name',
        name: 'What is your name?',
        placeholder: 'Please enter your name.',
        type: TextInputStyle.Short,
        minLength: 1,
        maxLength: 20,
        required: true
      }
    ]
  },
  //  Combined Tickets
  {
    id: 'apply-for-content-creator',
    name: 'Apply for Content Creator',
    type: 'COMBINED',
    categoryId: '1064877949641293865',
    loggingChannel: '1064887383348232292',
    description: 'Please be patient, a staff member will be with you shortly.',
    ticketClosingMessage: {
      enabled: true,
      description: 'Your ticket has been closed.',
      title: 'Ticket Closed'
    },
    maxTickets: 20,
    channelId: '1065267606552051812',
    acceptMessage:
      'Thank you for your application, we will be in touch shortly.',
    declineMessage:
      'Thank you for your application, unfortunately we are not looking for any more content creators at this time.',
    fields: [
      {
        id: 'Question',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      },
      {
        id: 'Name',
        name: 'What is your name?',
        placeholder: 'Please enter your name.',
        type: TextInputStyle.Short,
        minLength: 1,
        maxLength: 20,
        required: true
      }
    ]
  },
  //  Test Application Tickets
  {
    id: 'apply-for-beta-tester',
    name: 'Apply for Beta Tester',
    type: 'TEST-APPLICATION',
    channelId: '1065267606552051812',
    acceptMessage:
      'Thank you for your application, we will be in touch shortly.',
    declineMessage:
      'Thank you for your application, unfortunately we are not looking for any more beta testers at this time.',
    fields: [
      {
        id: 'query',
        name: 'What is your question?',
        placeholder: 'Please describe your question in detail.',
        type: TextInputStyle.Paragraph,
        minLength: 10,
        maxLength: 300,
        required: true
      },
      {
        id: 'name',
        name: 'What is your name?',
        placeholder: 'Please enter your name.',
        type: TextInputStyle.Short,
        minLength: 1,
        maxLength: 20,
        required: true
      },
      {
        id: 'Experience',
        name: 'Brief about your experience?',
        placeholder: 'Please enter your experience.',
        type: TextInputStyle.Paragraph,
        minLength: 1,
        maxLength: 300,
        required: true
      }
    ]
  }
];

export const TicketMenuData: TicketMenu[] = [
  {
    type: 'CHAT',
    title: 'Tickets',
    description:
      'Please select the relevant category and complete the format in as much detail as you can, to receive your support from our staff team.',
    embedColor: '#00FF00'
  },
  {
    type: 'APPLICATION',
    title: 'Application Tickets',
    description:
      'Please select the relevant category and complete the format in as much detail as you can, to submit your application to our recruitment team.',
    embedColor: '#FF0000'
  },
  {
    type: 'TEST-APPLICATION',
    title: 'Beta Tester Application',
    description:
      'Want to be an Official Beta Tester for our gamemodes? Please complete the format as to why we should choose you! and submit your application to our development team.',
    embedColor: '#0000FF'
  }
];
