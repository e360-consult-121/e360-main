"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadEmailToAdmin = void 0;
const configLinks_1 = require("../../../../../config/configLinks");
const EmailService_1 = require("../../../EmailService");
const leadEmailToAdmin = async (firstName, service, priority) => {
    let subject = '';
    let templateName = '';
    switch (priority) {
        case 'HIGH':
            subject = `High-Priority Lead Alert: ${firstName} – ${service}`;
            templateName = 'high-priority-form-filled';
            break;
        case 'MEDIUM':
            subject = `Review Needed: Potential Lead for ${firstName} – ${service}`;
            templateName = 'medium-priority-form-filled';
            break;
        case 'LOW':
            subject = `Non-Eligible Lead for ${firstName} – ${service}`;
            templateName = 'low-priority-form-filled';
            break;
    }
    await EmailService_1.EmailService.getInstance().sendEmail({
        to: configLinks_1.ADMIN_EMAIL,
        subject,
        templateName,
        templateCategory: 'admin/eligibility-form-filled',
        variables: {
            FirstName: firstName,
            Service: service,
            LinkToDashboard: configLinks_1.DASHBOARD_LINK,
        },
    });
};
exports.leadEmailToAdmin = leadEmailToAdmin;
