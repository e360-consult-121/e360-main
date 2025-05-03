"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constultationCallScheduled = void 0;
const configLinks_1 = require("../../../../../config/configLinks");
const enums_1 = require("../../../../../types/enums/enums");
const EmailService_1 = require("../../../EmailService");
const constultationCallScheduled = async (to, firstName, service, callDateTime, meetingLink, priority) => {
    let subject = '';
    let templateName = '';
    switch (priority) {
        case enums_1.leadPriority.HIGH:
            subject = `${firstName}, Your Consultation Call is Confirmed`;
            templateName = 'consultation-call-high-priority';
            break;
        case enums_1.leadPriority.MEDIUM:
            subject = `${firstName}, Your Call is Confirmed – Let’s Discuss Your Eligibility`;
            templateName = 'consultation-call-medium-priority';
            break;
    }
    await EmailService_1.EmailService.getInstance().sendEmail({
        to,
        subject,
        templateName,
        templateCategory: 'leads/consultation',
        variables: {
            FirstName: firstName,
            Service: service,
            CallDateTime: callDateTime,
            MeetingLink: meetingLink,
            WhatsappLink: configLinks_1.WHATSAPP_LINK
        },
    });
};
exports.constultationCallScheduled = constultationCallScheduled;
