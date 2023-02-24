const nodeMailer = require('nodemailer');
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpSecure = process.env.SMTP_SECURE || false;
const smtpRequireTLS = process.env.SMTP_REQUIRE_TLS || true;
const smtpName = process.env.SMTP_SENDER_NAME;
const smtpSender = process.env.SMTP_SENDER;
const smtpAuthUser = process.env.SMTP_AUTH_USER;
const smtpAuthPass = process.env.SMTP_AUTH_PASS;

transpoter = nodeMailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    sender: smtpSender,
    sender_name: smtpName,
    secure: smtpSecure,
    requireTLS: smtpRequireTLS,
    auth: {
        user: smtpAuthUser,
        pass: smtpAuthPass
    }
})

module.exports = transpoter;