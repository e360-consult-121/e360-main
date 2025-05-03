"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBothDetails = exports.uploadShippingDetails = exports.uploadDeliveryDetails = void 0;
const dgDelivery_1 = require("../../extraModels/dgDelivery");
const dgShipping_1 = require("../../extraModels/dgShipping");
const VisaApplicationStepStatus_1 = require("../../models/VisaApplicationStepStatus");
const mongoose_1 = __importDefault(require("mongoose"));
const applicationTriggerSegregate_1 = require("../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const enums_1 = require("../../types/enums/enums");
// user karega
const uploadDeliveryDetails = async (req, res) => {
    const { stepStatusId } = req.params;
    const { fullName, email, phoneNo, alternativePhoneNo, address, city, country, postalCode, } = req.body;
    const requiredFields = [
        "fullName",
        "email",
        "phoneNo",
        "address",
        "city",
        "country",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }
    const delivery = new dgDelivery_1.DgDeliveryModel({
        fullName,
        email,
        phoneNo,
        alternativePhoneNo,
        address,
        city,
        country,
        postalCode,
        stepStatusId,
    });
    const savedDelivery = await delivery.save();
    const emailData = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(stepStatusId) } },
        {
            $lookup: {
                from: "visaapplications",
                localField: "visaApplicationId",
                foreignField: "_id",
                as: "visaApplication",
            },
        },
        { $unwind: "$visaApplication" },
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
                from: "visasteps", // Adjust based on your actual collection name
                localField: "stepId",
                foreignField: "_id",
                as: "step",
            },
        },
        { $unwind: "$step" },
        {
            $project: {
                _id: 1,
                "user.name": 1,
                "user.email": 1,
                "visaType.visaType": 1,
                "step.emailTriggers": 1,
                status: 1,
            },
        },
    ]);
    // Send email notification if email triggers are configured
    if (emailData.length > 0 && emailData[0].step.emailTriggers) {
        const { user, visaType, step, status } = emailData[0];
        await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
            triggers: step.emailTriggers,
            stepStatus: enums_1.StepStatusEnum.SUBMITTED,
            visaType: visaType.visaType,
            email: user.email,
            firstName: user.name
        });
    }
    res.status(201).json({
        success: true,
        message: "Delivery details uploaded successfully",
        data: savedDelivery,
    });
};
exports.uploadDeliveryDetails = uploadDeliveryDetails;
// Admin karega
const uploadShippingDetails = async (req, res) => {
    const { stepStatusId } = req.params;
    const { courierService, trackingNo, trackingUrl, email, phoneNo } = req.body;
    console.log(req.body);
    const shipping = new dgShipping_1.DgShippingModel({
        courierService,
        trackingNo,
        trackingUrl,
        supportInfo: {
            email,
            phoneNo,
        },
        stepStatusId,
    });
    const savedShipping = await shipping.save();
    res.status(201).json({
        success: true,
        message: "Shipping details uploaded successfully",
        data: savedShipping,
    });
};
exports.uploadShippingDetails = uploadShippingDetails;
// isme authorizaAdmin nahi lagana , user&admin dono ke liye run karenge
const fetchBothDetails = async (req, res) => {
    const { stepStatusId } = req.params;
    const deliveryDetails = await dgDelivery_1.DgDeliveryModel.findOne({ stepStatusId });
    const shippingDetails = await dgShipping_1.DgShippingModel.findOne({ stepStatusId });
    res.status(200).json({
        success: true,
        message: "Fetched delivery and shipping details successfully",
        data: {
            delivery: deliveryDetails,
            shipping: shippingDetails,
        },
    });
};
exports.fetchBothDetails = fetchBothDetails;
