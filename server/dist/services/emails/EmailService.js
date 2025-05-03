"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const resend_1 = require("resend");
const EmailTemplateManager_1 = require("./EmailTemplateManager");
class EmailService {
    static instance;
    resend;
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_EMAIL_API_KEY);
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    async sendEmail(options) {
        const html = EmailTemplateManager_1.EmailTemplateManager.compileTemplate(options.templateCategory, options.templateName, options.variables, true // false here indicates plain text
        );
        await this.resend.emails.send({
            from: `E360 Consult <${process.env.EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            html,
        });
    }
}
exports.EmailService = EmailService;
