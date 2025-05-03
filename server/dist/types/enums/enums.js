"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalTestStatus = exports.moaStatusEnum = exports.tradeNameStatus = exports.aimaStatusEnum = exports.investmentOptionEnum = exports.dgInvestStatusEnum = exports.paymentPurpose = exports.paymentStatus = exports.consultationStatus = exports.leadStatus = exports.leadPriority = exports.reqCategoryEnum = exports.StepTypeEnum = exports.visaApplicationReqStatusEnum = exports.StepStatusEnum = exports.VisaApplicationStatusEnum = exports.QuestionTypeEnum = exports.DocumentSourceEnum = exports.FileType = exports.VisaTypeEnum = exports.RoleEnum = exports.AccountStatusEnum = void 0;
var AccountStatusEnum;
(function (AccountStatusEnum) {
    AccountStatusEnum["ACTIVE"] = "ACTIVE";
    AccountStatusEnum["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    AccountStatusEnum["SUSPENDED"] = "SUSPENDED";
    AccountStatusEnum["CLOSED"] = "CLOSED";
    AccountStatusEnum["BANNED"] = "BANNED";
    AccountStatusEnum["INACTIVE"] = "INACTIVE";
    AccountStatusEnum["LOCKED"] = "LOCKED";
    AccountStatusEnum["EXPIRED"] = "EXPIRED";
})(AccountStatusEnum || (exports.AccountStatusEnum = AccountStatusEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["ADMIN"] = "ADMIN";
    RoleEnum["USER"] = "USER";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var VisaTypeEnum;
(function (VisaTypeEnum) {
    VisaTypeEnum["DOMINICA"] = "Dominica";
    VisaTypeEnum["GRENADA"] = "Grenada";
    VisaTypeEnum["PORTUGAL"] = "Portugal";
    VisaTypeEnum["DUBAI"] = "Dubai";
})(VisaTypeEnum || (exports.VisaTypeEnum = VisaTypeEnum = {}));
var FileType;
(function (FileType) {
    FileType["IMAGE"] = "image";
    FileType["PDF"] = "pdf";
})(FileType || (exports.FileType = FileType = {}));
var DocumentSourceEnum;
(function (DocumentSourceEnum) {
    DocumentSourceEnum["ADMIN"] = "ADMIN";
    DocumentSourceEnum["USER"] = "USER";
})(DocumentSourceEnum || (exports.DocumentSourceEnum = DocumentSourceEnum = {}));
var QuestionTypeEnum;
(function (QuestionTypeEnum) {
    QuestionTypeEnum["TEXT"] = "TEXT";
    QuestionTypeEnum["EMAIL"] = "EMAIL";
    QuestionTypeEnum["PHONE_NUMBER"] = "PHONE_NUMBER";
    QuestionTypeEnum["DOB"] = "DOB";
    QuestionTypeEnum["RADIO"] = "RADIO";
    QuestionTypeEnum["CHECKBOX"] = "CHECKBOX";
    QuestionTypeEnum["DROPDOWN"] = "DROPDOWN";
    QuestionTypeEnum["IMAGE"] = "IMAGE";
    QuestionTypeEnum["PDF"] = "PDF";
    QuestionTypeEnum["SIGNATURE"] = "SIGNATURE";
})(QuestionTypeEnum || (exports.QuestionTypeEnum = QuestionTypeEnum = {}));
var VisaApplicationStatusEnum;
(function (VisaApplicationStatusEnum) {
    VisaApplicationStatusEnum["PENDING"] = "PENDING";
    VisaApplicationStatusEnum["IN_PROGRESS"] = "IN_PROGRESS";
    VisaApplicationStatusEnum["REJECTED"] = "REJECTED";
    VisaApplicationStatusEnum["APPROVED"] = "APPROVED";
    VisaApplicationStatusEnum["CANCELED"] = "CANCELED";
})(VisaApplicationStatusEnum || (exports.VisaApplicationStatusEnum = VisaApplicationStatusEnum = {}));
var StepStatusEnum;
(function (StepStatusEnum) {
    StepStatusEnum["IN_PROGRESS"] = "IN_PROGRESS";
    StepStatusEnum["SUBMITTED"] = "SUBMITTED";
    StepStatusEnum["APPROVED"] = "APPROVED";
    StepStatusEnum["REJECTED"] = "REJECTED";
})(StepStatusEnum || (exports.StepStatusEnum = StepStatusEnum = {}));
var visaApplicationReqStatusEnum;
(function (visaApplicationReqStatusEnum) {
    visaApplicationReqStatusEnum["NOT_UPLOADED"] = "NOT_UPLOADED";
    visaApplicationReqStatusEnum["UPLOADED"] = "UPLOADED";
    visaApplicationReqStatusEnum["VERIFIED"] = "VERIFIED";
    visaApplicationReqStatusEnum["RE_UPLOAD"] = "RE_UPLOAD";
})(visaApplicationReqStatusEnum || (exports.visaApplicationReqStatusEnum = visaApplicationReqStatusEnum = {}));
var StepTypeEnum;
(function (StepTypeEnum) {
    StepTypeEnum["MEDICAL_TEST"] = "MEDICAL_TEST";
    StepTypeEnum["DUBAI_PAYMENT"] = "DUBAI_PAYMENT";
    StepTypeEnum["TRADE_NAME"] = "TRADE_NAME";
    StepTypeEnum["MOA_SIGNING"] = "MOA_SIGNING";
    StepTypeEnum["BANK"] = "BANK";
    StepTypeEnum["DGDELIVERY"] = "DGDELIVERY";
    StepTypeEnum["GENERAL"] = "GENERAL";
    StepTypeEnum["DGINVESTMENT"] = "DGINVESTMENT";
    StepTypeEnum["STATUSUPDATE"] = "STATUSUPDATE";
    StepTypeEnum["EMPTY"] = "EMPTY";
    StepTypeEnum["AIMA"] = "AIMA";
})(StepTypeEnum || (exports.StepTypeEnum = StepTypeEnum = {}));
var reqCategoryEnum;
(function (reqCategoryEnum) {
    reqCategoryEnum["GENRAL"] = "GENRAL";
    reqCategoryEnum["SPOUSE"] = "SPOUSE";
    reqCategoryEnum["CHILD"] = "CHILD";
    reqCategoryEnum["TIME_SENSITIVE"] = "TIME_SENSITIVE";
})(reqCategoryEnum || (exports.reqCategoryEnum = reqCategoryEnum = {}));
var leadPriority;
(function (leadPriority) {
    leadPriority["HIGH"] = "HIGH";
    leadPriority["LOW"] = "LOW";
    leadPriority["MEDIUM"] = "MEDIUM";
})(leadPriority || (exports.leadPriority = leadPriority = {}));
var leadStatus;
(function (leadStatus) {
    leadStatus["INITIATED"] = "INITIATED";
    leadStatus["CONSULTATIONLINKSENT"] = "CONSULTATIONLINKSENT";
    leadStatus["CONSULTATIONSCHEDULED"] = "CONSULTATIONSCHEDULED";
    leadStatus["CONSULTATIONDONE"] = "CONSULTATIONDONE";
    leadStatus["PAYMENTLINKSENT"] = "PAYMENTLINKSENT";
    leadStatus["PAYMENTDONE"] = "PAYMENTDONE";
    leadStatus["REJECTED"] = "REJECTED";
})(leadStatus || (exports.leadStatus = leadStatus = {}));
var consultationStatus;
(function (consultationStatus) {
    consultationStatus["SCHEDULED"] = "SCHEDULED";
    consultationStatus["COMPLETED"] = "COMPLETED";
})(consultationStatus || (exports.consultationStatus = consultationStatus = {}));
var paymentStatus;
(function (paymentStatus) {
    paymentStatus["LINKSENT"] = "LINKSENT";
    paymentStatus["PENDING"] = "PENDING";
    paymentStatus["PAID"] = "PAID";
    paymentStatus["FAILED"] = "FAILED";
    paymentStatus["SESSIONEXPIRED"] = "SESSIONEXPIRED";
})(paymentStatus || (exports.paymentStatus = paymentStatus = {}));
var paymentPurpose;
(function (paymentPurpose) {
    paymentPurpose["CONSULTATION"] = "CONSULTATION";
    paymentPurpose["DUBAI_PAYMENT"] = "DUBAI_PAYMENT";
})(paymentPurpose || (exports.paymentPurpose = paymentPurpose = {}));
var dgInvestStatusEnum;
(function (dgInvestStatusEnum) {
    dgInvestStatusEnum["optionSelected"] = "optionSelected";
    dgInvestStatusEnum["realStateOptionsUploaded"] = "realStateOptionsUploaded";
    dgInvestStatusEnum["paymentDone"] = "paymentDone";
})(dgInvestStatusEnum || (exports.dgInvestStatusEnum = dgInvestStatusEnum = {}));
var investmentOptionEnum;
(function (investmentOptionEnum) {
    investmentOptionEnum["EDF"] = "EDF";
    investmentOptionEnum["NTF"] = "NTF";
    investmentOptionEnum["REAL_STATE"] = "REAL_STATE";
})(investmentOptionEnum || (exports.investmentOptionEnum = investmentOptionEnum = {}));
var aimaStatusEnum;
(function (aimaStatusEnum) {
    aimaStatusEnum["Appointment_Scheduled"] = "AIMA Appointment Scheduled";
    aimaStatusEnum["Visa_Approved"] = "Visa Approved";
    aimaStatusEnum["Appointment_Confirmed"] = "Appointment Confirmed";
    aimaStatusEnum["Application_Approved"] = "Application Approved";
})(aimaStatusEnum || (exports.aimaStatusEnum = aimaStatusEnum = {}));
var tradeNameStatus;
(function (tradeNameStatus) {
    tradeNameStatus["Pending"] = "Pending";
    tradeNameStatus["TradeNames_Uploaded"] = "TradeNames_Uploaded";
    tradeNameStatus["TradeName_Assigned"] = "TradeName_Assigned";
    tradeNameStatus["ChangeReq_Sent"] = "ChangeReq_Sent";
    tradeNameStatus["ChangeReq_Approved"] = "ChangeReq_Approved";
    tradeNameStatus["ChangeReq_Rejected"] = "ChangeReq_Rejected";
})(tradeNameStatus || (exports.tradeNameStatus = tradeNameStatus = {}));
var moaStatusEnum;
(function (moaStatusEnum) {
    moaStatusEnum["MOA_Preparing"] = "MOA_Preparing";
    moaStatusEnum["MOA_Uploaded"] = "MOA_Uploaded";
    moaStatusEnum["Sig_Uploaded"] = "Sig_Uploaded";
    moaStatusEnum["Sig_Approved"] = "Sig_Approved";
})(moaStatusEnum || (exports.moaStatusEnum = moaStatusEnum = {}));
var medicalTestStatus;
(function (medicalTestStatus) {
    medicalTestStatus["Pending"] = "Pending";
    medicalTestStatus["Scheduled"] = "Scheduled";
    medicalTestStatus["Completed"] = "Completed";
    medicalTestStatus["RescheduleReq_Sent"] = "RescheduleReq_Sent";
    medicalTestStatus["RescheduleReq_Approved"] = "RescheduleReq_Approved";
    medicalTestStatus["RescheduleReq_Rejected"] = "RescheduleReq_Rejected";
})(medicalTestStatus || (exports.medicalTestStatus = medicalTestStatus = {}));
