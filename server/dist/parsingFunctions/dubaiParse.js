"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDubaiData = parseDubaiData;
function parseDubaiData(rawData) {
    const profession = rawData?.q42_whichBest42 || "";
    const parsedData = {
        formId: rawData?.slug?.split("/")?.[1] || "",
        fullName: {
            first: rawData?.q1_fullName?.first || "",
            last: rawData?.q1_fullName?.last || ""
        },
        nationality: rawData?.q4_nationality || "",
        email: rawData?.q6_email || "",
        phone: rawData?.q61_fullPhone || "",
        profession,
        mainGoal: rawData?.q62_whatsYour62 || [],
        budgetRange: rawData?.q52_whatBudget || "",
        movingToDubai: rawData?.q54_areYou54 || "",
        visaIssues: rawData?.q55_haveYou55 || "",
        extraInfo: rawData?.q38_anythingElse || "",
        // saari optional fields me \initailly null daal do 
        businessOwner: {
            registeredBusiness: null,
            annualRevenue: null,
            relocationPlan: null
        },
        freelancer: {
            incomeSource: null,
            monthlyIncome: null,
            requriedLicenseType: null
        },
        employee: {
            transitionPlan: null,
            investmentCapital: null
        },
        investor: {
            investmentAmount: null,
            industryInterest: null,
            targetedIndustry: null
        },
        other: {
            otherProfessionDetail: null
        },
    };
    // Populate respective field based on profession
    switch (profession) {
        case "Business Owner / Entrepreneur":
            parsedData.businessOwner = {
                registeredBusiness: rawData?.q60_pleaseSpecify60 || null,
                annualRevenue: rawData?.q47_whatIs47 || null,
                relocationPlan: rawData?.q57_areYou57 || null
            };
            break;
        case "Freelancer / Remote Worker":
            parsedData.freelancer = {
                incomeSource: rawData?.q56_whatsYour || null,
                monthlyIncome: rawData?.q47_whatIs47 || null,
                requriedLicenseType: rawData?.q57_areYou57 || null
            };
            break;
        case "Employee / Professional":
            parsedData.employee = {
                transitionPlan: rawData?.q59_pleaseSpecify || null,
                investmentCapital: rawData?.q57_areYou57 || null
            };
            break;
        case "Investor":
            const industryInterest = rawData?.q58_areYou58 || null;
            parsedData.investor = {
                investmentAmount: rawData?.q50_whatIs || null,
                industryInterest,
                targetedIndustry: industryInterest === "Yes, I have a targeted industry"
                    ? rawData?.q9_whichBest9 || null
                    : null
            };
            break;
        case "Other (please specify)":
            parsedData.other = {
                otherProfessionDetail: rawData?.q60_pleaseSpecify60 || null,
            };
            break;
    }
    return parsedData;
}
