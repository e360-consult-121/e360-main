"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationUpdateEmails = void 0;
const applicationTriggers_1 = require("../admin/application/applicationTriggers");
const applicationTriggers_2 = require("../customer/application/applicationTriggers");
const sendApplicationUpdateEmails = async ({ triggers, stepStatus, visaType, email, firstName, }) => {
    const userTriggers = triggers.filter((trigger) => trigger.to === "USER" && trigger.status === stepStatus);
    const adminTriggers = triggers.filter((trigger) => trigger.to === "ADMIN" && trigger.status === stepStatus);
    console.log("Admin Triggers", adminTriggers);
    const emailPromises = [];
    if (userTriggers.length) {
        emailPromises.push((0, applicationTriggers_2.userApplicationUpdateSend)(userTriggers, email, firstName, visaType));
    }
    if (adminTriggers.length) {
        emailPromises.push((0, applicationTriggers_1.adminApplicationUpdateSend)(adminTriggers, firstName, visaType));
    }
    await Promise.all(emailPromises);
};
exports.sendApplicationUpdateEmails = sendApplicationUpdateEmails;
