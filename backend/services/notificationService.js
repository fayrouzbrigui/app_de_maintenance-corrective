const Notification = require('../models/notificationModel');
const { sendEmail } = require('./emailService');

const lastAlerts = {};

function shouldTrigger(key, delay = 10000) {
    const now = Date.now();

    if (!lastAlerts[key] || now - lastAlerts[key] > delay) {
        lastAlerts[key] = now;
        return true;
    }

    return false;
}

async function createNotification({ robotUuid, type, message, severity = 'low', data }) {
    try {
        const notification = new Notification({
            robotUuid,
            type,
            message,
            severity,
            data
        });

        await notification.save();

        console.log('Notification saved:', message);

        // ✅ FIXED: send full object (NOT subject/text)
        await sendEmail({
            robotUuid,
            type,
            severity,
            message,
            data
        });

        return notification;

    } catch (err) {
        console.error('Error saving notification:', err.message);
    }
}

module.exports = { createNotification, shouldTrigger };