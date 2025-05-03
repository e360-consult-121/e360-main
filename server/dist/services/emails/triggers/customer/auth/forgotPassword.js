"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = void 0;
const EmailService_1 = require("../../../EmailService");
const sendForgotPasswordEmail = async (name, resetLink, email) => {
    const subject = `New Password – ${name}`;
    const templateName = "forgot-password";
    await EmailService_1.EmailService.getInstance().sendEmail({
        to: email,
        subject,
        templateName,
        templateCategory: 'customer/auth',
        variables: {
            Name: name,
            ResetLink: resetLink
        },
    });
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
