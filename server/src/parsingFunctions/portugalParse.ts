type RawPortugalData = {
    q1_fullName?: { first?: string; last?: string };
    q4_nationality?: string;
    dropdown_search?: string;
    q6_email?: string;
    q71_fullPhone?: string;
    q42_whichBest42?: string;
    q50_areYou50?: string;
    q58_doYou58?: string;
    q59_pleaseSpecify?: string;
    q63_whatKind?: string[];
    q53_whatIs53?: string;
    q65_canYou?: string;
    q66_doYou?: string;
    q67_areYou?: string;
    q68_doYou68?: string;
    q69_willYou?: string;
    q70_howMany?: string;
    q64_howMany64?: string;
    q38_anythingElse?: string;
    event_id?: string;
    timeToSubmit?: number;
};

type ParsedPortugalData = {
    formId: string;
    fullName: {
        first: string;
        last: string;
    };
    nationality: string;
    email: string;
    phone: string;
    profession: string;

    businessOwner: {
        annualRevenue: string | null;
        isOneLakhInvestmentAvailable: string | null;
    } | null;

    remoteWorker: {
        monthlyIncomeFromRemoteWork: string | null;
        isSavingsInvestmentAvailable: string | null;
    } | null;

    investor: {
        investmentAmount: string | null;
        industryInterest: string | null;
        targetedIndustry: string | null;
    } | null;

    incomeSources: string[];
    monthlyIncomeRange: string | null;
    financialStatements: string | null;
    sufficientSavingsFor12Months: string | null;

    legalResidency: string | null;
    otherCitizenship: string | null;

    housingPlan: string | null;
    stayDuration: string | null;
    dependents: string | null;

    additionalInfo: string | null;

    event_id: string;
    timeToSubmit: number;
};



export const parsePortugalData = (rawData: RawPortugalData): ParsedPortugalData => {
    const profession = rawData.q42_whichBest42 || "";
    const formId = rawData?.event_id?.split("_")[1] || "";

    return {
        formId,
        fullName: {
            first: rawData.q1_fullName?.first || "",
            last: rawData.q1_fullName?.last || ""
        },
        nationality: rawData.q4_nationality || rawData.dropdown_search || "",
        email: rawData.q6_email || "",
        phone: rawData.q71_fullPhone || "",
        profession,

        businessOwner: profession === "Business Owner" ? {
            annualRevenue: rawData.q50_areYou50 || null,
            isOneLakhInvestmentAvailable: rawData.q58_doYou58 || null
        } : null,

        remoteWorker: profession === "Remote Worker" ? {
            monthlyIncomeFromRemoteWork: rawData.q50_areYou50 || null,
            isSavingsInvestmentAvailable: rawData.q58_doYou58 || null
        } : null,

        investor: profession === "Investor" ? {
            investmentAmount: rawData.q50_areYou50 || null,
            industryInterest: rawData.q58_doYou58 || null,
            targetedIndustry: rawData.q59_pleaseSpecify || null
        } : null,

        incomeSources: rawData.q63_whatKind || [],
        monthlyIncomeRange: rawData.q53_whatIs53 || null,
        financialStatements: rawData.q65_canYou || null,
        sufficientSavingsFor12Months: rawData.q66_doYou || null,

        legalResidency: rawData.q67_areYou || null,
        otherCitizenship: rawData.q68_doYou68 || null,

        housingPlan: rawData.q69_willYou || null,
        stayDuration: rawData.q70_howMany || null,
        dependents: rawData.q64_howMany64 || null,

        additionalInfo: rawData.q38_anythingElse || null,

        event_id: rawData.event_id || "",
        timeToSubmit: rawData.timeToSubmit || 0
    };
};






// parsing function 
// const parsePortugalForm = (rawData) => {

//     const formId = rawData?.event_id?.split('_')[1] || "";
//     return {
//         formId ,
//         fullName: {
//             first: rawData.q1_fullName?.first || "",
//             last: rawData.q1_fullName?.last || ""
//         },
//         nationality: rawData.q4_nationality || rawData.dropdown_search || "",
//         email: rawData.q6_email || "",
//         phone: rawData.q71_fullPhone || "",

//         profession: rawData.q42_whichBest42 || "",

//         // Business Owner Conditional Fields
//         businessOwner: rawData.q42_whichBest42 === "Business Owner" ? {
//             annualRevenue: rawData.q50_areYou50 || null,
//             isOneLakhInvestmentAvailable: rawData.q58_doYou58 || null
//         } : null,

//         // Remote Worker Conditional Fields
//         remoteWorker: rawData.q42_whichBest42 === "Remote Worker" ? {
//             monthlyIncomeFromRemoteWork: rawData.q50_areYou50 || null,
//             isSavingsInvestmentAvailable: rawData.q58_doYou58 || null
//         } : null,

//         // Investor Conditional Fields
//         investor: rawData.q42_whichBest42 === "Investor" ? {
//             investmentAmount: rawData.q50_areYou50 || null,
//             industryInterest: rawData.q58_doYou58 || null,
//             targetedIndustry: rawData.q59_pleaseSpecify || null
//         } : null,

//         // General Eligibility Questions
//         incomeSources: rawData.q63_whatKind || [],
//         monthlyIncomeRange: rawData.q53_whatIs53 || null,
//         financialStatements: rawData.q65_canYou || null,
//         sufficientSavingsFor12Months: rawData.q66_doYou || null,

//         // Residency & Citizenship Details
//         legalResidency: rawData.q67_areYou || null,
//         otherCitizenship: rawData.q68_doYou68 || null,

//         // Housing & Living Plans
//         housingPlan: rawData.q69_willYou || null,
//         stayDuration: rawData.q70_howMany || null,
//         dependents: rawData.q64_howMany64 || null,

//         additionalInfo: rawData.q38_anythingElse || null,

//         // Meta Data
//         event_id: rawData.event_id || "",
//         timeToSubmit: rawData.timeToSubmit || 0
//     };
// };