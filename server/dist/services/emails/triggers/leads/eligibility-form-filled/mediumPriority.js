"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMediumPriorityLeadEmail = void 0;
const EmailService_1 = require("../../../EmailService");
const sendMediumPriorityLeadEmail = async (to, firstName, service, consultationLink) => {
    const subject = `${firstName}, You might Qualify but we need more information!`;
    const templateName = 'medium-priority-form-filled';
    // Send the email for medium priority lead
    await EmailService_1.EmailService.getInstance().sendEmail({
        to,
        subject,
        templateName,
        templateCategory: 'leads/eligibility-form-filled',
        variables: {
            FirstName: firstName,
            Service: service,
            ExpertConsultationLink: consultationLink,
        },
    });
};
exports.sendMediumPriorityLeadEmail = sendMediumPriorityLeadEmail;
