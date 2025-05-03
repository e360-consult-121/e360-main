"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPortalAccessToClient = void 0;
const configLinks_1 = require("../../../../../config/configLinks");
const EmailService_1 = require("../../../EmailService");
const sendPortalAccessToClient = async (to, firstName, service, password) => {
    const subject = `Welcome Aboard, ${firstName} — Your ${service} Journey Begins Now`;
    const templateName = 'payment-successful';
    await EmailService_1.EmailService.getInstance().sendEmail({
        to,
        subject,
        templateName,
        templateCategory: 'leads/payment',
        variables: {
            FirstName: firstName,
            Service: service,
            PortalLink: "https://app.e360consult.com",
            Email: to,
            Password: password,
            WhatsAppLink: configLinks_1.WHATSAPP_LINK,
        },
    });
};
exports.sendPortalAccessToClient = sendPortalAccessToClient;
