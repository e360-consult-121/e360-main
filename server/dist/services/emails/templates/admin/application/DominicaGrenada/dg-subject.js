"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDgAdminSubject = void 0;
const getDgAdminSubject = (name, templateId) => {
    let subject = '';
    switch (templateId) {
        case 'dg-admin-documents-submitted':
            subject = `${name} Documents Uploaded – Begin Verification`;
            break;
        case 'dg-admin-delivery-submitted':
            subject = `${name} Delivery Address is added`;
            break;
        default:
            subject = `${name}, Application Status Update`;
    }
    return subject;
};
exports.getDgAdminSubject = getDgAdminSubject;
