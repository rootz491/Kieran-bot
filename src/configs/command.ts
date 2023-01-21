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
                text: "testing",
                icon_url: "",
            },
            timestamp: true,
            image: ""
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
            image: "https://static.wikia.nocookie.net/peaky-blinders/images/8/8e/Tommys3.jpg/revision/latest?cb=20190715140230"
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
            image: ""
        }
    },
    {
        name: "roles",
        embed: {
            title: "Roles",
            description: "Please select a role below to be notified of updates.\n\nJust click on role below to get the role.",
            color: '#00ff00',
            fields: [
                {
                    name: "Events 🎉",
                    value: "Get notified of upcoming events."
                },
                {
                    name: "Media 📺",
                    value: "Get notified of new media."
                },
                {
                    name: "Change Logs 📝",
                    value: "Get notified of new changes."
                },
                {
                    name: "Notices 📢",
                    value: "Get notified of new notices."
                }
            ],
            footer: {
                text: "Server Name",
                icon_url: "",
            },
            timestamp: true,
            image: ""
        },
        roles: [
            {
                name: "Events",
                id: "1064932373994680421",
                emoji: "🎉"
            },
            {
                name: "Media",
                id: "1064932456760873081",
                emoji: "📺"
            },
            {
                name: "Change Logs",
                id: "1064932493142278234",
                emoji: "📝"
            },
            {
                name: "Notices",
                id: "1064932532254167181",
                emoji: "📢"
            },
        ]
    }
]