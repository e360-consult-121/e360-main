"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentLinkToLead = void 0;
const EmailService_1 = require("../../../EmailService");
const sendPaymentLinkToLead = async (to, firstName, service, paymentLink) => {
    const subject = `Your Next Step Towards ${service}`;
    const templateName = 'payment-link-send';
    await EmailService_1.EmailService.getInstance().sendEmail({
        to,
        subject,
        templateName,
        templateCategory: 'leads/payment',
        variables: {
            FirstName: firstName,
            Service: service,
            PaymentLink: paymentLink,
        },
    });
};
exports.sendPaymentLinkToLead = sendPaymentLinkToLead;
