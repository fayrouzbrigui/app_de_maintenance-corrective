function notificationEmail({ robotUuid, type, severity, message, data }) {
    return `
🚨 Robot Alert System

Robot: ${robotUuid}
Type: ${type}
Severity: ${severity}

Message: ${message}

Data:
${JSON.stringify(data, null, 2)}
    `;
}

module.exports = { notificationEmail };