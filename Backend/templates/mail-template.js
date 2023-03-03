const websiteName = process.env.WEBSITE_NAME || 'Buscar Médicos - Colih';

class MailTemplate {
    forgotPassword = (name, otp) => {
        const subject = `${websiteName} - Recuperação de senha`;
        const text = `Prezado ${name},\nEssa mensagem é porque você esqueceu a sua senha. Se você não fez esta solicitação, por favor ignore o email.`;
        return { subject, text };
    }

    Welcome = (name, otp) => {
        const subject = `${websiteName} - Acesso ao sistema`;
        const text = `Prezado ${name},\nVocê está recebendo essa mensagem porque agora você pode acessar o Colih App. Se você não fez esta solicitação, por favor ignore o email.`;
        return { subject, text };
    }


}

module.exports = new MailTemplate();