"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortugalUserSubject = void 0;
const getPortugalUserSubject = (name, templateId) => {
    let subject = '';
    switch (templateId) {
        case 'portugal-aima-approved':
            subject = `Your AIMA Appointment is schedule for D7 Visa`;
            break;
        case 'portugal-bank-approved':
            subject = `Congratulations! Your Portuguese Bank Account is Opened`;
            break;
        case 'portugal-user-documents-approved':
            subject = `We’ve Received Your Documents – Review in Progress`;
            break;
        case 'portugal-user-documents-submitted':
            subject = `We’ve Received Your Documents - Review in Progress`;
            break;
        case 'portugal-user-nif-submitted':
            subject = `Thanks! We received your NIF Document.`;
            break;
        case 'portugal-visa-approved':
            subject = `Congratulations! Your D7 Visa Is Approved`;
            break;
        default:
            subject = `${name}, Your Application Status Update`;
    }
    return subject;
};
exports.getPortugalUserSubject = getPortugalUserSubject;
