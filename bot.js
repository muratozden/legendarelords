const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment-timezone');

// Bot token
const token = process.env.BOT_TOKEN;

// Create bot
const bot = new TelegramBot(token, {
    polling: true
});

// Store data
const clanData = {
    announcements: []
};

// Log every message
bot.on('message', (msg) => {
    console.log('Incoming message:', msg.text);

    // Check commands
    const command = msg.text.split(' ')[0];
    const args = msg.text.split(' ').slice(1).join(' ');

    switch (command) {
        case '/start':
            handleStart(msg);
            break;
        case '/announcement':
            handleAnnouncement(msg, args);
            break;
        case '/list':
            handleList(msg);
            break;
        case '/delete_announcement':
            handleDeleteAnnouncement(msg, args);
            break;
    }
});

// Start command handler
function handleStart(msg) {
    const welcomeMessage = `
Welcome! 🎉
I’m Legend Age Lords Clan Bot! 🛡️⚔️

With this bot, you can easily track upcoming events, important announcements, and in-game updates. 🚀
I’m here to assist you in every way possible!

🎯 Don’t forget! Turn on notifications to make sure you never miss an event!

Let’s march toward victory! 🏆✨

Usage commands:
/list - List all active announcements
/announcement - Add a new announcement (Admins only)
/delete_announcement - Delete an announcement (Admins only)
    `;
    bot.sendMessage(msg.chat.id, welcomeMessage);
}

// Announcement command handler
function handleAnnouncement(msg, text) {
    if (!isAdmin(msg)) {
        bot.sendMessage(msg.chat.id, '❌ You do not have permission to add announcements.');
        return;
    }

    if (!text) {
        bot.sendMessage(msg.chat.id, 'Please provide an announcement text.\nExample: /announcement Clan war this week!');
        return;
    }

    clanData.announcements.push({
        text: text
    });

    bot.sendMessage(msg.chat.id, '✅ Announcement added successfully!');
}

// List command handler
function handleList(msg) {
    if (clanData.announcements.length === 0) {
        bot.sendMessage(msg.chat.id, 'There are no active announcements.');
        return;
    }

    let response = '📢 Active Announcements:\n\n';
    clanData.announcements.forEach((announcement, index) => {
        response += `#${index + 1}: ${announcement.text}\n`;
    });

    bot.sendMessage(msg.chat.id, response);
}

// Delete announcement command handler
function handleDeleteAnnouncement(msg, args) {
    if (!isAdmin(msg)) {
        bot.sendMessage(msg.chat.id, '❌ You do not have permission to delete announcements.');
        return;
    }

    const index = parseInt(args, 10) - 1;
    if (isNaN(index) || index < 0 || index >= clanData.announcements.length) {
        bot.sendMessage(msg.chat.id, '❌ Invalid announcement number.');
        return;
    }

    clanData.announcements.splice(index, 1);
    bot.sendMessage(msg.chat.id, '✅ Announcement deleted successfully!');
}

// Admin check function
function isAdmin(msg) {
    const adminUsernames = ['muratozden']; // Replace with actual admin usernames
    return adminUsernames.includes(msg.from.username);
}

// Handle polling errors
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.response?.body || error.message || error);
});

console.log('Bot started!');
