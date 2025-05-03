"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLowPriorityLeadEmail = void 0;
const EmailService_1 = require("../../../EmailService");
const sendLowPriorityLeadEmail = async (to, firstName, service, blogLink, newsletterSignUpLink) => {
    const subject = `${firstName}, Thank You for Your Interest!`;
    const templateName = 'low-priority-form-filled';
    // Send the email for low priority lead
    await EmailService_1.EmailService.getInstance().sendEmail({
        to,
        subject,
        templateName,
        templateCategory: 'leads/eligibility-form-filled',
        variables: {
            FirstName: firstName,
            Service: service,
            BlogLink: blogLink,
            NewsletterSignUpLink: newsletterSignUpLink,
        },
    });
};
exports.sendLowPriorityLeadEmail = sendLowPriorityLeadEmail;
