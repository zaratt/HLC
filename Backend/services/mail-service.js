const transport = require('../configs/mail-config');
const mailTemplate = require('../templates/mail-template');
const smtpName = process.env.SMTP_SENDER_NAME || 'Colih App';

class MailService {


    sendForgotPasswordMail = async (name, email, otp) => {
        const { subject, text } = mailTemplate.forgotPassword(name, otp);
        return await this.sendMail(email, subject, text);
    }


    sendMail = async (to, subject, text) => {
        const mailOption = {
            from: smtpName,
            to,
            subject,
            text
        }

        await transport.sendMail(mailOption, (err, info) => {
            console.log(err);
            console.log(info);
        })

    }

}

module.exports = new MailService();