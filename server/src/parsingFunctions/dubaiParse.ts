type RawDubaiData = {
    q1_fullName?: { first?: string; last?: string };
    q4_nationality?: string;
    q6_email?: string;
    q61_fullPhone?: string;
    q42_whichBest42?: string;
    q62_whatsYour62?: string[];
    q52_whatBudget?: string;
    q54_areYou54?: string;
    q55_haveYou55?: string;
    q38_anythingElse?: string;
    slug?: string;
    q60_pleaseSpecify60?: string;
    q47_whatIs47?: string;
    q57_areYou57?: string;
    q56_whatsYour?: string;
    q59_pleaseSpecify?: string;
    q58_areYou58?: string;
    q9_whichBest9?: string;
    q50_whatIs?: string;
};

type ParsedDubaiData = {
    fullName: { first: string; last: string };
    nationality: string;
    email: string;
    phone: string;
    profession: string;
    mainGoal: string[];
    budgetRange: string;
    movingToDubai: string;
    visaIssues: string;
    additionalInfo: string;
    formId: string;

    otherProfessionDetail: string | null;
    businessOwner: {
        registeredBusiness: string;
        annualRevenue: string;
        relocationPlan: string;
    } | null;
    freelancer: {
        incomeSource: string;
        monthlyIncome: string;
        requriedLicenseType: string;
    } | null;
    employee: {
        transitionPlan: string;
        investmentCapital: string;
    } | null;
    investor: {
        investmentAmount: string;
        industryInterest: string;
        targetedIndustry: string | null;
    } | null;
};




// function parseDubaiData(rawData) {
//     let parsedData = {
//         fullName: {
//             first: rawData?.q1_fullName?.first || "",
//             last: rawData?.q1_fullName?.last || ""
//         },
//         nationality: rawData?.q4_nationality || "",
//         email: rawData?.q6_email || "",
//         phone: rawData?.q61_fullPhone || "",
//         profession: rawData?.q42_whichBest42 || "",
//         mainGoal: rawData?.q62_whatsYour62 || [],
//         budgetRange: rawData?.q52_whatBudget || "",
//         movingToDubai: rawData?.q54_areYou54 || "",
//         visaIssues: rawData?.q55_haveYou55 || "",
//         additionalInfo: rawData?.q38_anythingElse || "",
//         formId: rawData?.slug?.split("/")?.[1] || "",

//         // Edge case default values
//         otherProfessionDetail: null,  // Edge case handled here
//         businessOwner: null,
//         freelancer: null,
//         employee: null,
//         investor: null
//     };

//     let profession = parsedData.profession;

//     if (profession === "Business Owner / Entrepreneur") {
//         parsedData.businessOwner = {
//             registeredBusiness: rawData?.q60_pleaseSpecify60 || "",
//             annualRevenue: rawData?.q47_whatIs47 || "",
//             relocationPlan: rawData?.q57_areYou57 || ""
//         };
//     } else if (profession === "Freelancer / Remote Worker") {
//         parsedData.freelancer = {
//             incomeSource: rawData?.q56_whatsYour || "",
//             monthlyIncome: rawData?.q47_whatIs47 || "",
//             requriedLicenseType: rawData?.q57_areYou57 || ""
//         };
//     } else if (profession === "Employee / Professional") {
//         parsedData.employee = {
//             transitionPlan: rawData?.q59_pleaseSpecify || "",
//             investmentCapital: rawData?.q57_areYou57 || ""
//         };
//     } else if (profession === "Investor") {
//         const industryInterest = rawData?.q58_areYou58 || "";

//         parsedData.investor = {
//             investmentAmount: rawData?.q50_whatIs || "",
//             industryInterest: industryInterest,
//             targetedIndustry: industryInterest === "Yes, I have a targeted industry"
//                 ? rawData?.q9_whichBest9 || ""
//                 : null //  Edge case handled here
//         };
//     } else if (profession === "Other (please specify)") {
//         parsedData.otherProfessionDetail = rawData?.q60_pleaseSpecify60 || "";
//     }

//     return parsedData;
// }


export function parseDubaiData(rawData: RawDubaiData): ParsedDubaiData {
    let parsedData: ParsedDubaiData = {
        fullName: {
            first: rawData?.q1_fullName?.first || "",
            last: rawData?.q1_fullName?.last || ""
        },
        nationality: rawData?.q4_nationality || "",
        email: rawData?.q6_email || "",
        phone: rawData?.q61_fullPhone || "",
        profession: rawData?.q42_whichBest42 || "",
        mainGoal: rawData?.q62_whatsYour62 || [],
        budgetRange: rawData?.q52_whatBudget || "",
        movingToDubai: rawData?.q54_areYou54 || "",
        visaIssues: rawData?.q55_haveYou55 || "",
        additionalInfo: rawData?.q38_anythingElse || "",
        formId: rawData?.slug?.split("/")?.[1] || "",

        otherProfessionDetail: null,
        businessOwner: null,
        freelancer: null,
        employee: null,
        investor: null
    };

    const profession = parsedData.profession;

    if (profession === "Business Owner / Entrepreneur") {
        parsedData.businessOwner = {
            registeredBusiness: rawData?.q60_pleaseSpecify60 || "",
            annualRevenue: rawData?.q47_whatIs47 || "",
            relocationPlan: rawData?.q57_areYou57 || ""
        };
    } else if (profession === "Freelancer / Remote Worker") {
        parsedData.freelancer = {
            incomeSource: rawData?.q56_whatsYour || "",
            monthlyIncome: rawData?.q47_whatIs47 || "",
            requriedLicenseType: rawData?.q57_areYou57 || ""
        };
    } else if (profession === "Employee / Professional") {
        parsedData.employee = {
            transitionPlan: rawData?.q59_pleaseSpecify || "",
            investmentCapital: rawData?.q57_areYou57 || ""
        };
    } else if (profession === "Investor") {
        const industryInterest = rawData?.q58_areYou58 || "";

        parsedData.investor = {
            investmentAmount: rawData?.q50_whatIs || "",
            industryInterest: industryInterest,
            targetedIndustry: industryInterest === "Yes, I have a targeted industry"
                ? rawData?.q9_whichBest9 || ""
                : null
        };
    } else if (profession === "Other") {
        parsedData.otherProfessionDetail = rawData?.q60_pleaseSpecify60 || "";
    }

    return parsedData;
}