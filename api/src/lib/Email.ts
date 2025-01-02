import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_HOST_PORT, EMAIL_HOST_TLS, EMAIL_AUTH_USER, EMAIL_AUTH_PASSWORD } from '../config/keys';

export const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_HOST_PORT,
    secure: EMAIL_HOST_TLS,
    auth: {
        user: EMAIL_AUTH_USER,
        pass: EMAIL_AUTH_PASSWORD,
    },
});

export default class Email {
    userName: string;
    message?: string; // message can be both string or html
    type: 'text' | 'html';
    receiver: string;
    sender: string;
    subject: string;
    constructor(userName: string, receiverEmail: string, subject: string, message: string, type: 'text' | 'html') {
        this.userName = userName;
        this.type = type;
        this.receiver = receiverEmail;
        this.sender = 'c1d203053d-bcb734+1@inbox.mailtrap.io';
        this.message = message;
        this.subject = subject;
    }

    async sendMail() {
        const response = await transporter.sendMail({
            from: this.sender,
            to: this.receiver,

            subject: this.subject,
            html: this.type === 'html' ? this.message : '',
            text: this.type === 'text' ? this.message : '',
        });

        return response;
    }

    // mail sending logic
}
