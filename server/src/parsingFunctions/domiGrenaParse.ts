type RawxxxData = {
    q1_fullName?: { first?: string; last?: string };
    q4_nationality?: string;
    dropdown_search?: string;
    q6_email?: string;
    q62_fullPhone?: string;

    q42_whichBest42?: string;
    q59_pleaseSpecify?: string;
    q47_areYou47?: string;
    q56_whatIs?: string;

    q53_whatsYour53?: string;
    q52_whatBudget?: string;
    q54_areYou54?: string;
    q55_haveYou55?: string;
    q38_anythingElse?: string;

    slug?: string;
    event_id?: string;
    timeToSubmit?: number;
};



// Final structured parsed data
type ParsedxxxData = {
    fullName: {
        first: string;
        last: string;
    };
    nationality: string;
    email: string;
    phone: string;
    profession: string;
    otherProfessionDetail: string | null;

    businessOwner: {
        registeredBusiness: string | null;
        annualRevenue: string | null;
        investmentPreference: string | null;
    };

    investor: {
        readyToInvest: string | null;
        investmentRoute: string | null;
    };

    HNWI: {
        totalAssets: string | null;
        citizenshipReason: string | null;
    };

    employee: {
        monthlyIncome: string | null;
        isInvestmentCapitalReady: string | null;
    };

    mainGoal: string;
    budgetRange: string;
    movingToApply: string;
    visaIssues: string;
    additionalInfo: string;

    event_id: string;
    timeToSubmit: number;
    formId: string;
};





// const parseDominicaGrenadaForm = (rawData) => {
//     const profession = rawData.q42_whichBest42 || "";

// // Extract formId from slug (e.g., "submit/250912364956463")
//     const formId = rawData.slug?.split("/")[1] || "";

//     return {
//         fullName: {
//             first: rawData.q1_fullName?.first || "",
//             last: rawData.q1_fullName?.last || ""
//         },
//         nationality: rawData.q4_nationality || rawData.dropdown_search || "",
//         email: rawData.q6_email || "",
//         phone: rawData.q62_fullPhone || "",

//         profession: profession,

//         // Only set this if profession is "Other"
//         otherProfessionDetail: profession === "Other" ? (rawData.q59_pleaseSpecify || null) : null,

//         businessOwner: {
//             registeredBusiness: rawData.q47_areYou47 || null,
//             annualRevenue: rawData.q56_whatIs || null,
//             investmentPreference: rawData.q59_pleaseSpecify || null
//         },

//         investor: {
//             readyToInvest: rawData.q47_areYou47 || null,
//             investmentRoute: rawData.q59_pleaseSpecify || null
//         },

//         HNWI: {
//             totalAssets: rawData.q56_whatIs || null,
//             citizenshipReason: rawData.q47_areYou47 || null
//         },

//         employee: {
//             monthlyIncome: rawData.q56_whatIs || null,
//             isInvestmentCapitalReady: rawData.q59_pleaseSpecify || null
//         },

//         mainGoal: rawData.q53_whatsYour53 || "",
//         budgetRange: rawData.q52_whatBudget || "",
//         movingToApply: rawData.q54_areYou54 || "",
//         visaIssues: rawData.q55_haveYou55 || "",

//         additionalInfo: rawData.q38_anythingElse || "",

//         event_id: rawData.event_id || "",
//         timeToSubmit: rawData.timeToSubmit || 0 , 
//         formId: formId
//     };
// };



export const parseDomiGrenaData = (rawData: RawxxxData): ParsedxxxData => {
    
    const profession = rawData.q42_whichBest42 || "";
    const formId = rawData.slug?.split("/")[1] || "";

    const commonField1 = rawData.q59_pleaseSpecify || null;
    const commonField2 = rawData.q47_areYou47 || null;
    const commonField3 = rawData.q56_whatIs || null;

    return {
        fullName: {
            first: rawData.q1_fullName?.first || "",
            last: rawData.q1_fullName?.last || ""
        },
        nationality: rawData.q4_nationality || rawData.dropdown_search || "",
        email: rawData.q6_email || "",
        phone: rawData.q62_fullPhone || "",
        profession: profession,
        otherProfessionDetail: profession === "Other" ? commonField1 : null,

        businessOwner: profession === "Business Owner" ? {
            registeredBusiness: commonField2,
            annualRevenue: commonField3,
            investmentPreference: commonField1
        } : {
            registeredBusiness: null,
            annualRevenue: null,
            investmentPreference: null
        },

        investor: profession === "Investor" ? {
            readyToInvest: commonField2,
            investmentRoute: commonField1
        } : {
            readyToInvest: null,
            investmentRoute: null
        },

        HNWI: profession === "HNWI" ? {
            totalAssets: commonField3,
            citizenshipReason: commonField2
        } : {
            totalAssets: null,
            citizenshipReason: null
        },

        employee: profession === "Employee" ? {
            monthlyIncome: commonField3,
            isInvestmentCapitalReady: commonField1
        } : {
            monthlyIncome: null,
            isInvestmentCapitalReady: null
        },

        mainGoal: rawData.q53_whatsYour53 || "",
        budgetRange: rawData.q52_whatBudget || "",
        movingToApply: rawData.q54_areYou54 || "",
        visaIssues: rawData.q55_haveYou55 || "",
        additionalInfo: rawData.q38_anythingElse || "",

        event_id: rawData.event_id || "",
        timeToSubmit: rawData.timeToSubmit || 0,
        formId: formId
    };
};
