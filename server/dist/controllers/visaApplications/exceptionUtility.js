"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDgInvestmentStepResponse = void 0;
const dgInvestment_1 = require("../../extraModels/dgInvestment");
const dgBankDetails_1 = require("../../extraModels/dgBankDetails");
const enums_1 = require("../../types/enums/enums");
const getDgInvestmentStepResponse = async ({ stepStatusId, }) => {
    const dgInvestment = await dgInvestment_1.DgInvestmentModel.findOne({ stepStatusId });
    if (!dgInvestment) {
        return {
            statusCode: 200,
            message: "Investmetn option not selected yet.",
        };
    }
    const { investmentOption, dgInvestStatus, invoiceUrl, realStateOptions } = dgInvestment;
    // 11 & 12: EDF or NTF → fetch bankDetails + invoiceUrl
    if (investmentOption === enums_1.investmentOptionEnum.EDF ||
        investmentOption === enums_1.investmentOptionEnum.NTF) {
        const visaTypeName = investmentOption === enums_1.investmentOptionEnum.EDF ? "DOMINICA" : "GRENADA";
        const bankDetails = await dgBankDetails_1.DgBankDetailsModel.findOne({ visaTypeName });
        if (dgInvestStatus === enums_1.dgInvestStatusEnum.optionSelected ||
            dgInvestStatus === enums_1.dgInvestStatusEnum.paymentDone) {
            return {
                statusCode: 200,
                message: "Investment info fetched successfully.",
                dgInvestmentData: {
                    investInfo: {
                        investmentOption,
                        dgInvestStatus,
                        invoiceUrl,
                    },
                    bankDetails,
                },
            };
        }
    }
    // REAL_STATE → include realStateOptions
    else if (investmentOption === enums_1.investmentOptionEnum.REAL_STATE) {
        return {
            statusCode: 200,
            message: "Investment info fetched successfully.",
            dgInvestmentData: {
                investInfo: {
                    investmentOption,
                    status: dgInvestStatus,
                    invoiceUrl,
                    realStateOptions,
                },
            },
        };
    }
    // Fallback case
    return {
        statusCode: 400,
        message: "Invalid investment option or status.",
    };
};
exports.getDgInvestmentStepResponse = getDgInvestmentStepResponse;
