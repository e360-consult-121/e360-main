"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGrenadaData = void 0;
const parseGrenadaData = (rawData) => {
    const profession = rawData?.q42_whichBest42 || "";
    const parsedData = {
        formId: rawData?.slug?.split("/")?.[1] || "",
        visaTypeName: "GRENADA",
        fullName: {
            first: rawData?.q1_fullName?.first || "",
            last: rawData?.q1_fullName?.last || ""
        },
        nationality: rawData?.q4_nationality || rawData?.dropdown_search || "",
        email: rawData?.q6_email || "",
        phone: rawData?.q62_fullPhone || "",
        profession,
        mainGoal: rawData?.q53_whatsYour53 || "",
        budgetRange: rawData?.q52_whatBudget || "",
        movingToApply: rawData?.q54_areYou54 || "",
        visaIssues: rawData?.q55_haveYou55 || "",
        extraInfo: rawData?.q38_anythingElse || "",
        event_id: rawData?.event_id || "",
        // timeToSubmit: rawData?.timeToSubmit || 0,
        // Optional fields set to null initially
        businessOwner: {
            registeredBusiness: null,
            annualRevenue: null,
            investmentPreference: null
        },
        investor: {
            readyToInvest: null,
            investmentRoute: null
        },
        HNWI: {
            totalAssets: null,
            citizenshipReason: null
        },
        employee: {
            monthlyIncome: null,
            isInvestmentCapitalReady: null
        },
        other: {
            otherProfessionDetail: null,
        },
    };
    // Populate respective field based on profession
    switch (profession) {
        case "Business Owner / Entrepreneur":
            parsedData.businessOwner = {
                registeredBusiness: rawData?.q43_doYou43 || null,
                annualRevenue: rawData?.q44_whatsYour44 || null,
                investmentPreference: rawData?.q45_areYou || null
            };
            break;
        case "Investor":
            parsedData.investor = {
                readyToInvest: rawData?.q50_areYou50 || null,
                investmentRoute: rawData?.q58_whichInvestment || null
            };
            break;
        case "High-Net-Worth Individual (HNWI)":
            parsedData.HNWI = {
                totalAssets: rawData?.q56_whatIs || null,
                citizenshipReason: rawData?.q47_areYou47 || null
            };
            break;
        case "Employee / Professional":
            parsedData.employee = {
                monthlyIncome: rawData?.q60_whatIs60 || null,
                isInvestmentCapitalReady: rawData?.q61_doYou || null
            };
            break;
        case "Other":
            parsedData.other = {
                otherProfessionDetail: rawData?.q59_pleaseSpecify || null,
            };
            break;
    }
    return parsedData;
};
exports.parseGrenadaData = parseGrenadaData;
