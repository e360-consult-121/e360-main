import mongoose, { Schema, Document } from "mongoose";

// 1. TypeScript Interface
export interface IDgBankDetails extends Document {
  visaTypeName: "DOMINICA" | "GRENADA";
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscOrSwiftCode: string;
  currency: string;
  note?: string;
}

// 2. Mongoose Schema
const dgBankDetailsSchema: Schema = new Schema(
  {
    visaTypeName: {
      type: String,
      enum: ["DOMINICA", "GRENADA"],
      required: true,
      unique: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifscOrSwiftCode: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 3. Mongoose Model
export const DgBankDetailsModel = mongoose.model<IDgBankDetails>(
  "DgBankDetails",
  dgBankDetailsSchema
);

export default DgBankDetailsModel;
