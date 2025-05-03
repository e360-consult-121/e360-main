"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationCallScheduledAdmin = void 0;
const configLinks_1 = require("../../../../../config/configLinks");
const EmailService_1 = require("../../../EmailService");
const consultationCallScheduledAdmin = async (firstName, service, callDateTime, meetingLink) => {
    const subject = `Consultation Booked – ${firstName} for ${service}`;
    const templateName = "consultation-call-scheduled";
    await EmailService_1.EmailService.getInstance().sendEmail({
        to: configLinks_1.ADMIN_EMAIL,
        subject,
        templateName,
        templateCategory: 'admin/consultation',
        variables: {
            FirstName: firstName,
            Service: service,
            CallDateTime: callDateTime,
            MeetingLink: meetingLink,
        },
    });
};
exports.consultationCallScheduledAdmin = consultationCallScheduledAdmin;
