// models/monthlyLeadStats.model.ts

import { Schema, model, Document } from "mongoose";

export interface IMonthlyLeadStats extends Document {
  year: number;
  month: number; // 1 to 12
  leadCount: number;
  conversionCount: number;
  conversionRate: number; // percent (0 to 100)
  pendingApplications: number;
  completedApplications: number;
}

const monthlyLeadStatsSchema = new Schema<IMonthlyLeadStats>(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    leadCount: { type: Number, default: 0 },
    conversionCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }, // % value (ex: 42.1)
    pendingApplications: { type: Number, default: 0 },
    completedApplications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

monthlyLeadStatsSchema.index({ year: 1, month: 1 }, { unique: true });

export const MonthlyLeadStats = model<IMonthlyLeadStats>(
  "MonthlyLeadStats",
  monthlyLeadStatsSchema
);
