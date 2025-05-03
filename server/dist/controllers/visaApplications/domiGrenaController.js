"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadInvoice = exports.addOptionsForRealState = exports.selectOption = void 0;
const enums_1 = require("../../types/enums/enums");
const dgInvestment_1 = require("../../extraModels/dgInvestment");
const VisaApplicationStepStatus_1 = require("../../models/VisaApplicationStepStatus");
const selectOption = async (req, res) => {
    const { stepStatusId } = req.params;
    const { investmentOption } = req.body;
    if (!investmentOption) {
        res.status(400).json({ message: "investmentOption is required" });
        return;
    }
    if (!Object.values(enums_1.investmentOptionEnum).includes(investmentOption)) {
        res.status(400).json({ message: `Invalid investmentOption. Allowed values: ${Object.values(enums_1.investmentOptionEnum).join(", ")}` });
        return;
    }
    const newInvestment = await dgInvestment_1.DgInvestmentModel.create({
        stepStatusId,
        investmentOption,
        dgInvestStatus: enums_1.dgInvestStatusEnum.optionSelected,
    });
    if (investmentOption === enums_1.investmentOptionEnum.REAL_STATE) {
        await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findByIdAndUpdate(stepStatusId, {
            $set: { status: enums_1.StepStatusEnum.SUBMITTED },
        });
    }
    res.status(201).json({
        message: "Investment option selected successfully",
        data: newInvestment,
    });
};
exports.selectOption = selectOption;
const addOptionsForRealState = async (req, res) => {
    const { stepStatusId } = req.params;
    const { realStateOptions } = req.body;
    if (!Array.isArray(realStateOptions)) {
        res.status(400).json({ message: "realStateOptions must be an array" });
        return;
    }
    const updatedInvestment = await dgInvestment_1.DgInvestmentModel.findOneAndUpdate({ stepStatusId }, {
        realStateOptions,
        dgInvestStatus: enums_1.dgInvestStatusEnum.realStateOptionsUploaded,
    }, { new: true });
    if (!updatedInvestment) {
        res.status(404).json({ message: "Investment not found for given stepStatusId" });
        return;
    }
    await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findByIdAndUpdate(stepStatusId, {
        $set: { status: enums_1.StepStatusEnum.IN_PROGRESS },
    });
    res.status(200).json({
        message: "Real state options added successfully",
        data: updatedInvestment,
    });
};
exports.addOptionsForRealState = addOptionsForRealState;
const uploadInvoice = async (req, res) => {
    const { stepStatusId } = req.params;
    if (!req.file) {
        res.status(400).json({ message: "No invoice file uploaded" });
        return;
    }
    const file = req.file;
    // Use `location` if using S3, otherwise fallback to `path`
    const invoiceUrl = file.location;
    const updatedInvestment = await dgInvestment_1.DgInvestmentModel.findOneAndUpdate({ stepStatusId }, { invoiceUrl }, { new: true });
    if (!updatedInvestment) {
        res.status(404).json({ message: "Investment not found for given stepStatusId" });
        return;
    }
    await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findByIdAndUpdate(stepStatusId, {
        $set: { status: enums_1.StepStatusEnum.SUBMITTED },
    });
    res.status(200).json({
        message: "Invoice uploaded successfully",
        data: updatedInvestment,
    });
};
exports.uploadInvoice = uploadInvoice;
