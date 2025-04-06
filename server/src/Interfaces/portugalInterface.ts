import mongoose, { Schema, Document } from "mongoose";

export interface IPortugalForm extends Document {
  formId: string;
  fullName: {
    first: string;
    last: string;
  };
  nationality: string;
  email: string;
  phone: string;

  profession: "Business Owner" | "Remote Worker" | "Investor" | "Retired / Pensioner";

  businessOwner?: {
    annualRevenue?: "Less than €50,000" | "€50,000 – €150,000" | "€150,000 – €500,000" | "€500,000+";
    isOneLakhInvestmentAvailable?: "Yes" | "No" | "Not sure";
  };

  remoteWorker?: {
    monthlyIncomeFromRemoteWork?: "Less than €1,500" | "€1,500 – €5,000" | "€5,000+";
    isSavingsInvestmentAvailable?: "Yes" | "No" | "Not sure";
  };

  investor?: {
    investmentAmount?: "Less than €50,000" | "€50,000 - €100,000" | "€100,000 - €250,000" | "€250,000+";
    industryInterest?: "Yes, I have targeted industry" | "No, I am open to profitable options";
    targetedIndustry?: string;
  };

  incomeSources?: (
    | "Salary"
    | "Pension"
    | "Business Revenues"
    | "Rental Earnings"
    | "Investment Returns"
    | "Diverse Income Streams"
  )[];
  
  monthlyIncomeRange?: "€500 – €1,000" | "€1,000 – €2,000" | "€2,000 – €4,000" | "Above €4,000";
  financialStatements?: "Yes, complete records" | "Yes, but incomplete records" | "No documentation";
  sufficientSavingsFor12Months?: "Yes, at least €10,000+ in savings" | "Less than €10,000" | "No savings";

  legalResidency?: "Yes, legally documented" | "Yes, but status is unclear" | "No legal residency anywhere";
  otherCitizenship?: "Yes, EU or visa-friendly passport" | "Yes, but with travel restrictions" | "No second passport & restricted mobility";

  housingPlan?: "Yes, planning to rent or buy" | "Undecided but open to it" | "No plans for housing";
  stayDuration?: "More than 183 days per year" | "Less than 183 days per year (May require alternative visa options)" | "No long-term residency plans";
  dependents?: "1–4 dependents (with financial means)" | "5+ dependents (requires proof of financial capability)" | "Cannot financially support dependents";

  additionalInfo?: string;
  event_id: string;
  timeToSubmit: number;
}

const PortugalSchema: Schema = new Schema({
  formId: { type: String, required: true },

  fullName: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  nationality: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  profession: {
    type: String,
    enum: ["Business Owner", "Remote Worker", "Investor", "Retired / Pensioner"],
    required: true
  },

  businessOwner: {
    annualRevenue: {
      type: String,
      enum: ["Less than €50,000", "€50,000 – €150,000", "€150,000 – €500,000", "€500,000+"],
      default: null
    },
    isOneLakhInvestmentAvailable: {
      type: String,
      enum: ["Yes", "No", "Not sure"],
      default: null
    }
  },

  remoteWorker: {
    monthlyIncomeFromRemoteWork: {
      type: String,
      enum: ["Less than €1,500", "€1,500 – €5,000", "€5,000+"],
      default: null
    },
    isSavingsInvestmentAvailable: {
      type: String,
      enum: ["Yes", "No", "Not sure"],
      default: null
    }
  },

  investor: {
    investmentAmount: {
      type: String,
      enum: ["Less than €50,000", "€50,000 - €100,000", "€100,000 - €250,000", "€250,000+"],
      default: null
    },
    industryInterest: {
      type: String,
      enum: ["Yes, I have targeted industry", "No, I am open to profitable options"],
      default: null
    },
    targetedIndustry: { type: String, default: null }
  },

  incomeSources: {
    type: [String],
    enum: ["Salary", "Pension", "Business Revenues", "Rental Earnings", "Investment Returns", "Diverse Income Streams"],
    default: []
  },

  monthlyIncomeRange: {
    type: String,
    enum: ["€500 – €1,000", "€1,000 – €2,000", "€2,000 – €4,000", "Above €4,000"],
    default: null
  },

  financialStatements: {
    type: String,
    enum: ["Yes, complete records", "Yes, but incomplete records", "No documentation"],
    default: null
  },

  sufficientSavingsFor12Months: {
    type: String,
    enum: ["Yes, at least €10,000+ in savings", "Less than €10,000", "No savings"],
    default: null
  },

  legalResidency: {
    type: String,
    enum: ["Yes, legally documented", "Yes, but status is unclear", "No legal residency anywhere"],
    default: null
  },

  otherCitizenship: {
    type: String,
    enum: ["Yes, EU or visa-friendly passport", "Yes, but with travel restrictions", "No second passport & restricted mobility"],
    default: null
  },

  housingPlan: {
    type: String,
    enum: ["Yes, planning to rent or buy", "Undecided but open to it", "No plans for housing"],
    default: null
  },

  stayDuration: {
    type: String,
    enum: [
      "More than 183 days per year",
      "Less than 183 days per year (May require alternative visa options)",
      "No long-term residency plans"
    ],
    default: null
  },

  dependents: {
    type: String,
    enum: [
      "1–4 dependents (with financial means)",
      "5+ dependents (requires proof of financial capability)",
      "Cannot financially support dependents"
    ],
    default: null
  },

  additionalInfo: { type: String, default: null },

  event_id: { type: String, required: true },
  timeToSubmit: { type: Number, required: true }
});

export const PortugalFormModel = mongoose.model<IPortugalForm>("PortugalForm", PortugalSchema);





