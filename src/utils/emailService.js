import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Verificação',
        text: `Seu código de verificação é: ${token}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de verificação enviado para ${email}`);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
    }
} 