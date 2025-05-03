"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMedicalTestInfo = exports.rejectReschedulingReq = exports.approveReschedulingReq = exports.sendReschedulingReq = exports.markTestAsCompleted = exports.uploadMedicalTestDetails = void 0;
const medicalTestModel_1 = require("../../../extraModels/medicalTestModel");
const enums_1 = require("../../../types/enums/enums");
const mongoose_1 = __importDefault(require("mongoose"));
const applicationTriggerSegregate_1 = require("../../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const VisaApplicationStepStatus_1 = require("../../../models/VisaApplicationStepStatus");
// For Admin
const uploadMedicalTestDetails = async (req, res) => {
    const { stepStatusId } = req.params;
    const { date, time, hospitalName, address, contactNumber } = req.body;
    const updatedTest = await medicalTestModel_1.MedicalTestModel.findOneAndUpdate({ stepStatusId }, {
        date,
        time,
        hospitalName,
        address,
        contactNumber,
        status: enums_1.medicalTestStatus.Scheduled,
    }, {
        new: true, // return the updated document
        upsert: true, // create a new one if it doesn't exist
        setDefaultsOnInsert: true,
    });
    const aggregationResult = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(stepStatusId) } },
        {
            $lookup: {
                from: "visasteps",
                localField: "stepId",
                foreignField: "_id",
                as: "visaStep",
            },
        },
        { $unwind: "$visaStep" },
        {
            $lookup: {
                from: "visatypes",
                localField: "visaTypeId",
                foreignField: "_id",
                as: "visaType",
            },
        },
        { $unwind: "$visaType" },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $project: {
                visaApplicationId: 1,
                visaStepId: 1,
                visaTypeId: 1,
                userId: 1,
                "visaStep.emailTriggers": 1,
                "visaType.visaType": 1,
                "user.email": 1,
                "user.name": 1,
            },
        },
    ]).exec();
    if (!aggregationResult.length) {
        console.error("Required data not found for stepStatusId:", stepStatusId);
        throw new Error("Required data not found for stepStatusId:" + stepStatusId);
    }
    await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
        triggers: aggregationResult[0].visaStep.emailTriggers,
        stepStatus: enums_1.StepStatusEnum.SUBMITTED,
        visaType: aggregationResult[0].visaType.visaType,
        email: aggregationResult[0].user.email,
        firstName: aggregationResult[0].user.name,
    });
    return res.status(200).json({
        message: "Medical test added successfully",
        doc: updatedTest,
    });
};
exports.uploadMedicalTestDetails = uploadMedicalTestDetails;
// For Admin
const markTestAsCompleted = async (req, res) => {
    const { stepStatusId } = req.params;
    const test = await medicalTestModel_1.MedicalTestModel.findOne({ stepStatusId });
    if (!test) {
        return res
            .status(404)
            .json({ message: "Medical test not found for the given stepStatusId" });
    }
    test.status = enums_1.medicalTestStatus.Completed;
    await test.save();
    res.status(200).json({
        message: "Medical test marked as completed",
        updatedDoc: test,
    });
};
exports.markTestAsCompleted = markTestAsCompleted;
// For User
const sendReschedulingReq = async (req, res) => {
    const { stepStatusId } = req.params;
    const { reason } = req.body;
    const test = await medicalTestModel_1.MedicalTestModel.findOne({ stepStatusId });
    if (!reason) {
        return res.status(400).json({ message: "Reason for reschedule is required" });
    }
    if (!test) {
        return res
            .status(404)
            .json({ message: "Medical test not found for the given stepStatusId" });
    }
    // Prevent reschedule if already requested or if already completed
    if (test.status === enums_1.medicalTestStatus.RescheduleReq_Sent ||
        test.status === enums_1.medicalTestStatus.Completed) {
        return res.status(400).json({
            message: test.status === enums_1.medicalTestStatus.Completed
                ? "Cannot reschedule a completed test"
                : "Reschedule request already sent",
        });
    }
    test.status = enums_1.medicalTestStatus.RescheduleReq_Sent;
    test.rescheduleReason = reason;
    await test.save();
    res.status(200).json({
        message: "Reschedule request sent successfully",
        updatedDoc: test,
    });
};
exports.sendReschedulingReq = sendReschedulingReq;
// For Admin
const approveReschedulingReq = async (req, res) => {
    const { stepStatusId } = req.params;
    const { date, time, hospitalName, address, contactNumber } = req.body;
    const test = await medicalTestModel_1.MedicalTestModel.findOne({ stepStatusId });
    if (!test) {
        return res
            .status(404)
            .json({ message: "Medical test not found for the given stepStatusId" });
    }
    if (test.status !== enums_1.medicalTestStatus.RescheduleReq_Sent ||
        !test.rescheduleReason) {
        return res
            .status(400)
            .json({ message: "No reschedule request found to approve" });
    }
    // Update with the new date and time
    test.date = date; // If null, retain original date
    test.time = time;
    test.hospitalName = hospitalName;
    test.address = address;
    test.contactNumber = contactNumber; // If null, retain original time
    test.status = enums_1.medicalTestStatus.RescheduleReq_Approved;
    await test.save();
    res.status(200).json({
        message: "Reschedule request approved and test details updated",
        updatedDoc: test,
    });
};
exports.approveReschedulingReq = approveReschedulingReq;
// For User
const rejectReschedulingReq = async (req, res) => {
    const { stepStatusId } = req.params;
    const test = await medicalTestModel_1.MedicalTestModel.findOneAndUpdate({
        stepStatusId,
        status: enums_1.medicalTestStatus.RescheduleReq_Sent, // only update if this status is set
    }, {
        status: enums_1.medicalTestStatus.RescheduleReq_Rejected,
        requestedSlot: null,
    }, { new: true } // return updated doc
    );
    if (!test) {
        return res.status(400).json({
            message: "Either medical test not found or no reschedule request was sent",
        });
    }
    res.status(200).json({
        message: "Reschedule request rejected successfully",
        data: test,
    });
};
exports.rejectReschedulingReq = rejectReschedulingReq;
// For Common
const fetchMedicalTestInfo = async (req, res) => {
    const { stepStatusId } = req.params;
    const test = await medicalTestModel_1.MedicalTestModel.findOne({ stepStatusId });
    if (!test) {
        return res
            .status(200)
            .json({ message: "No medical test found", data: null });
    }
    return res.status(200).json({
        message: "Medical test details fetched successfully",
        data: {
            medicalInfo: test,
        },
    });
};
exports.fetchMedicalTestInfo = fetchMedicalTestInfo;
// return wala case bhi dekhna hai ....
