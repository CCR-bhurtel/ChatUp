export default class Email {
    userName: string;
    html: string;
    receiver: string;
    sender: string;
    constructor(userName: string, html: string, receiverEmail: string) {
        this.userName = userName;
        this.html = html;
        this.receiver = receiverEmail;
        this.sender = '<no-reply>@chatup.com';
    }

    async sendMail() {
        // mail sending logic
    }
}
