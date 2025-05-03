"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationModel = void 0;
const mongoose_1 = require("mongoose");
const leadModel_1 = require("./leadModel");
const enums_1 = require("../types/enums/enums");
//  Ek leadId ke corresponding multiple consultations ho sakti hai ....
// fir toh isme caseId wala part bhi problem karga ...
const ConsultationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(enums_1.consultationStatus),
        default: enums_1.consultationStatus.SCHEDULED,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    joinUrl: { type: String, required: true },
    calendlyEventUrl: { type: String, required: true },
    rescheduleUrl: { type: String, required: true },
    formattedDate: { type: String },
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: leadModel_1.LeadModel.modelName,
        required: true,
    },
    // caseId: {
    //   type: String,
    //   unique: true,
    //   required : true ,
    // }
});
exports.ConsultationModel = (0, mongoose_1.model)("Consultation", ConsultationSchema);
// Sample calendly payload data
// {
//     "event": "invitee.created",
//     "payload": {
//       "invitee": {
//         "email": "user@example.com",
//         "name": "Ramesh",
//         "questions_and_answers": [],
//         "scheduled_event": "https://api.calendly.com/scheduled_events/ABCDEFG"
//       },
//       "event": {
//         "start_time": "2025-04-09T10:00:00Z",
//         "end_time": "2025-04-09T10:15:00Z"
//       }
//     }
//   }
