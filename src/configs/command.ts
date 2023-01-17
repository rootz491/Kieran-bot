import { Command } from "../types/command";

export const CommandData: Command[] = [
    {
        name: "welcome",
        embed: {
            title: "Welcome to the server!",
            description: "Please read the rules and enjoy your stay!",
            color: '#00ff00',
            fields: [
                {
                    name: "Rules",
                    value: "Please read the rules."
                },
                {
                    name: "Staff",
                    value: "If you have any questions, please contact a staff member."
                },
                {
                    name: "Tickets",
                    value: "If you need help, please open a ticket."
                }
            ],
            footer: {
                text: "Server Name",
                icon_url: "",
            },
            timestamp: true,
        },
    },
    {
        name: "rules",
        embed: {
            title: "Rules",
            description: "Please select a category below.",
            color: '#00ff00',
            fields: [
                {
                    name: "Rules",
                    value: "Please read the rules."
                },
                {
                    name: "Staff",
                    value: "If you have any questions, please contact a staff member."
                },
                {
                    name: "Tickets",
                    value: "If you need help, please open a ticket."
                }
            ],
            footer: {
                text: "Server Name",
                icon_url: "",
            },
            timestamp: true,
        }
    },
    {
        name: "wiki",
        embed: {
            title: "Wiki",
            description: "Please select a category below.",
            color: '#00ff00',
            fields: [
                {
                    name: "Rules",
                    value: "Please read the rules."
                },
                {
                    name: "Staff",
                    value: "If you have any questions, please contact a staff member."
                },
                {
                    name: "Tickets",
                    value: "If you need help, please open a ticket."
                }
            ],
            footer: {
                text: "Server Name",
                icon_url: "",
            },
            timestamp: true,
        }
    },
    {
        name: "roles",
        embed: {
            title: "Roles",
            description: "Please select a role below to be notified of updates.\n\nJust click on buttons below to get the role.",
            color: '#00ff00',
            fields: [
                {
                    name: "Events",
                    value: "Get notified of upcoming events."
                },
                {
                    name: "Media",
                    value: "Get notified of new media."
                },
                {
                    name: "ChangeLogs",
                    value: "Get notified of new changes."
                },
                {
                    name: "Notices",
                    value: "Get notified of new notices."
                }
            ],
            footer: {
                text: "Server Name",
                icon_url: "",
            },
            timestamp: true,
        },
        roles: [
            {
                name: "Events",
                id: "1064932373994680421"
            },
            {
                name: "Media",
                id: "1064932456760873081"
            },
            {
                name: "Change Logs",
                id: "1064932493142278234"
            },
            {
                name: "Notices",
                id: "1064932532254167181"
            },
        ]
    }
]