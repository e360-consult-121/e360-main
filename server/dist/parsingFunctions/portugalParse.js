"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePortugalData = void 0;
const parsePortugalData = (rawData) => {
    const profession = rawData?.q42_whichBest42 || "";
    const formId = rawData?.event_id?.split("_")[1] || "";
    const parsedData = {
        formId,
        fullName: {
            first: rawData?.q1_fullName?.first || "",
            last: rawData?.q1_fullName?.last || ""
        },
        nationality: rawData?.q4_nationality || rawData?.dropdown_search || "",
        email: rawData?.q6_email || "",
        phone: rawData?.q71_fullPhone || "",
        profession,
        // Saari optional fields me initially null rakh do ...
        businessOwner: {
            annualRevenue: null,
            isOneLakhInvestmentAvailable: null
        },
        remoteWorker: {
            monthlyIncomeFromRemoteWork: null,
            isSavingsInvestmentAvailable: null
        },
        investor: {
            investmentAmount: null,
            industryInterest: null,
            targetedIndustry: null
        },
        incomeSources: rawData?.q63_whatKind || [],
        monthlyIncomeRange: rawData?.q53_whatIs53 || "",
        financialStatements: rawData?.q65_canYou || "",
        sufficientSavingsFor12Months: rawData?.q66_doYou || "",
        legalResidency: rawData?.q67_areYou || "",
        otherCitizenship: rawData?.q68_doYou68 || "",
        housingPlan: rawData?.q69_willYou || "",
        stayDuration: rawData?.q70_howMany || "",
        dependents: rawData?.q64_howMany64 || "",
        extraInfo: rawData?.q38_anythingElse || "",
        event_id: rawData?.event_id || "",
        // timeToSubmit: rawData?.timeToSubmit || 0
    };
    // Populate profession-specific fields
    switch (profession) {
        case "Business Owner":
            parsedData.businessOwner = {
                annualRevenue: rawData?.q50_areYou50 || null,
                isOneLakhInvestmentAvailable: rawData?.q58_doYou58 || null
            };
            break;
        case "Remote Worker":
            parsedData.remoteWorker = {
                monthlyIncomeFromRemoteWork: rawData?.q50_areYou50 || null,
                isSavingsInvestmentAvailable: rawData?.q58_doYou58 || null
            };
            break;
        case "Investor":
            const industryInterest = rawData?.q47_areYou47 || null;
            parsedData.investor = {
                investmentAmount: rawData?.q56_whatIs || null,
                industryInterest,
                targetedIndustry: industryInterest === "Yes, I have a targeted industry"
                    ? rawData?.q59_pleaseSpecify || null
                    : null
            };
            break;
    }
    return parsedData;
};
exports.parsePortugalData = parsePortugalData;
