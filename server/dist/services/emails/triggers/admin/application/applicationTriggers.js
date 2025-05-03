"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApplicationUpdateSend = void 0;
const configLinks_1 = require("../../../../../config/configLinks");
const EmailService_1 = require("../../../EmailService");
const enums_1 = require("../../../../../types/enums/enums");
const dg_subject_1 = require("../../../templates/admin/application/DominicaGrenada/dg-subject");
const leadToServiceType_1 = require("../../../../../utils/leadToServiceType");
const portugal_subject_1 = require("../../../templates/admin/application/Portugal/portugal-subject");
const dubai_subjects_1 = require("../../../templates/admin/application/Dubai/dubai-subjects");
const adminApplicationUpdateSend = async (triggers, customerName, visaType) => {
    let templateCategory = "";
    let subjectFn;
    if (visaType === "Dominica" || visaType === "Grenada") {
        templateCategory = "admin/application/DominicaGrenada";
        subjectFn = dg_subject_1.getDgAdminSubject;
    }
    else if (visaType === enums_1.VisaTypeEnum.PORTUGAL) {
        templateCategory = "admin/application/Portugal";
        subjectFn = portugal_subject_1.getPortugalAdminSubject;
    }
    else if (visaType === enums_1.VisaTypeEnum.DUBAI) {
        templateCategory = "admin/application/Dubai";
        subjectFn = dubai_subjects_1.getDubaiAdminSubject;
    }
    const emailPromises = triggers.map(async (trigger) => {
        const { templateId } = trigger;
        const subject = subjectFn
            ? subjectFn(customerName, templateId)
            : "Application Update";
        console.log("Admin Email Trigger", {
            customerName,
            templateId,
            subject,
            templateCategory,
        });
        return EmailService_1.EmailService.getInstance().sendEmail({
            to: configLinks_1.ADMIN_EMAIL,
            subject,
            templateName: templateId,
            templateCategory,
            variables: {
                CustomerName: customerName,
                AdminPortalLink: configLinks_1.DASHBOARD_LINK,
                Service: (0, leadToServiceType_1.getServiceType)(visaType),
            },
        });
    });
    await Promise.all(emailPromises);
};
exports.adminApplicationUpdateSend = adminApplicationUpdateSend;
