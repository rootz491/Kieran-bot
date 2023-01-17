import { Ticket, TicketMenu } from '../types/ticket';

const TicketData: Ticket[] = [
  //  Chat Tickets
  {
    id: 'clain-reward',
    name: 'Claim a Reward',
    type: 'CHAT',
    categoryId: '1024085417299017828',
    loggingChannel: '1039619114576117760',
    description: '',
    ticketClosingMessage: {
      enabled: true,
      title: 'Ticket Closed',
      description: 'Your ticket has been closed. If you have any further questions, please open a new ticket.'
    }
  },
  {
    id: 'contact-admin',
    name: 'Contact an Admin',
    type: 'CHAT',
    categoryId: '1024085579106885763',
    loggingChannel: '1039619114576117760',
    description: '',
    ticketClosingMessage: {
      enabled: false,
    }
  },
  {
    id: 'report-bug',
    name: 'Report a Bug',
    type: 'CHAT',
    categoryId: '1039862828280074260',
    loggingChannel: '1039619114576117760',
    description: '',
    ticketClosingMessage: {
      enabled: false,
    }
  },
  {
    id: 'report-player',
    name: 'Report a Player ',
    type: 'CHAT',
    categoryId: '1024085500736315432',
    loggingChannel: '1058142239714451497',
    description: '',
    ticketClosingMessage: {
      enabled: false,
    }
  },
  {
    id: 'appeal-punishment',
    name: 'Appeal a Punishment',
    type: 'CHAT',
    categoryId: '1024085786708164628',
    loggingChannel: '1058142239714451497',
    description: '',
    ticketClosingMessage: {
      enabled: false,
    }
  },
  {
    id: 'other-inquiries',
    name: 'Other Inquiries',
    type: 'CHAT',
    categoryId: '1024085914554748938',
    loggingChannel: '1058142239714451497',
    description: '',
    ticketClosingMessage: {
      enabled: false,
    }
  },
  //  Application Tickets
  {
    id: 'apply-for-staff',
    name: 'Apply for Staff',
    type: 'APPLICATION',
    channelId: '-',
    loggingChannel: '1058142184358027314',
    description: 'Please select the relevant category and complete the format in as much detail as you can, to submit your application to our recruitment team.',
    acceptMessage: 'Thank you for your application, we will be in touch shortly.',
    declineMessage: 'Thank you for your application, unfortunately we are not looking for any more staff at this time.'
  },
  {
    id: 'apply-for-builder',
    name: 'Apply for Builder',
    type: 'APPLICATION',
    channelId: '-',
    loggingChannel: '1058142184358027314',
    description: 'Please select the relevant category and complete the format in as much detail as you can, to submit your application to our recruitment team.',
    acceptMessage: 'Thank you for your application, we will be in touch shortly.',
    declineMessage: 'Thank you for your application, unfortunately we are not looking for any more builders at this time.'
  },
  {
    id: 'apply-for-content-creator',
    name: 'Apply for Content Creator',
    type: 'APPLICATION',
    channelId: '-',
    loggingChannel: '1058142184358027314',
    description: 'Please select the relevant category and complete the format in as much detail as you can, to submit your application to our recruitment team.',
    acceptMessage: 'Thank you for your application, we will be in touch shortly.',
    declineMessage: 'Thank you for your application, unfortunately we are not looking for any more content creators at this time.'
  },
  {
    id: 'apply-for-beta-tester',
    name: 'Apply for Beta Tester',
    type: 'TEST-APPLICATION',
    channelId: '-',
    loggingChannel: '1058142184358027314',
    description: 'Want to be an Official Beta Tester for our gamemodes? Please complete the format as to why we should choose you! and submit your application to our development team.',
    acceptMessage: 'Thank you for your application, we will be in touch shortly.',
    declineMessage: 'Thank you for your application, unfortunately we are not looking for any more beta testers at this time.'
  }
];

export const TicketMenuData: TicketMenu[] = [
  {
    type: 'CHAT',
    description: 'Please select the relevant category and complete the format in as much detail as you can, to receive your support from our staff team.',
  },
  {
    type: 'APPLICATION',
    description: 'Please select the relevant category and complete the format in as much detail as you can, to submit your application to our recruitment team.'
  },
  {
    type: 'TEST-APPLICATION',
    description: 'Want to be an Official Beta Tester for our gamemodes? Please complete the format as to why we should choose you! and submit your application to our development team.'
  }
]

export default TicketData;