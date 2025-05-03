"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_EMAIL_API_KEY);
async function sendEmail({ to, subject, html }) {
    try {
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM, // fixed sender
            to,
            subject,
            html,
        });
        return data;
    }
    catch (error) {
        console.error(' Email failed:', error);
        throw error;
    }
}
// from , to , subject , html
