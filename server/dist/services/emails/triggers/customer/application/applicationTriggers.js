"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userApplicationUpdateSend = void 0;
const configLinks_1 = require("../../../../../config/configLinks");
const EmailService_1 = require("../../../EmailService");
const enums_1 = require("../../../../../types/enums/enums");
const dg_subjects_1 = require("../../../templates/customer/application/DominicaGrenada/dg-subjects");
const portugal_subject_1 = require("../../../templates/customer/application/Portugal/portugal-subject");
const dubai_subjects_1 = require("../../../templates/customer/application/Dubai/dubai-subjects");
const userApplicationUpdateSend = async (triggers, email, firstName, visaType) => {
    let templateCategory = "";
    let subjectFn;
    if (visaType === "Dominica" || visaType === "Grenada") {
        templateCategory = "customer/application/DominicaGrenada";
        subjectFn = dg_subjects_1.getDgUserSubject;
    }
    else if (visaType === enums_1.VisaTypeEnum.PORTUGAL) {
        templateCategory = "customer/application/Portugal";
        subjectFn = portugal_subject_1.getPortugalUserSubject;
    }
    else if (visaType === enums_1.VisaTypeEnum.DUBAI) {
        templateCategory = "customer/application/Dubai";
        subjectFn = dubai_subjects_1.getDubaiUserSubject;
    }
    const emailPromises = triggers.map(async (trigger) => {
        const { templateId } = trigger;
        const subject = subjectFn ? subjectFn(firstName, templateId) : "Application Update";
        return EmailService_1.EmailService.getInstance().sendEmail({
            to: email,
            subject,
            templateName: templateId,
            templateCategory,
            variables: {
                FirstName: firstName,
                PortalLink: configLinks_1.PORTAL_LINK,
                WhatsAppLink: configLinks_1.WHATSAPP_LINK,
            },
        });
    });
    await Promise.all(emailPromises);
};
exports.userApplicationUpdateSend = userApplicationUpdateSend;
