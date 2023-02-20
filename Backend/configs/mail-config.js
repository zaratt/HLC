const nodeMailer = require('nodemailer');
const smtpHost = process.env.SMTP_HOST || 'live.smtp.mailtrap.io';
const smtpPort = process.env.SMTP_PORT || 587;
const smtpSecure = process.env.SMTP_SECURE || false;
const smtpRequireTLS = process.env.SMTP_REQUIRE_TLS || true;
const smtpName = process.env.SMTP_SENDER_NAME || 'Colih App';
const smtpSender = process.env.SMTP_SENDER || 'mailtrap@lodgytechnology.com';
const smtpAuthUser = process.env.SMTP_AUTH_USER || 'api';
const smtpAuthPass = process.env.SMTP_AUTH_PASS || 'd5f5b4e0573a5bef094f61cc47a53b46';

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