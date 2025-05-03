"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHighPriorityLeadEmail = void 0;
const EmailService_1 = require("../../../EmailService");
const sendHighPriorityLeadEmail = async (to, firstName, service, consultationLink) => {
    const subject = `${firstName}, You're Eligible! We’re Holding a Spot for You`;
    const templateName = 'high-priority-form-filled';
    await EmailService_1.EmailService.getInstance().sendEmail({
        to,
        subject,
        templateName,
        templateCategory: 'leads/eligibility-form-filled',
        variables: {
            FirstName: firstName,
            Service: service,
            ConsultationLink: consultationLink,
        },
    });
};
exports.sendHighPriorityLeadEmail = sendHighPriorityLeadEmail;
