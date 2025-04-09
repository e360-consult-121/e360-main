import { Schema, model, Document } from "mongoose";
import { leadStatus } from "../types/enums/enums"; 

export interface ILead extends Document {
  formId: string;
  fullName: {
    first: string;
    last: string;
  };
  nationality: string;
  email: string;
  phone: string;

  leadStatus: leadStatus;

  timeToSubmit: number;

  additionalInfo?: Record<string, any>;
}



const LeadSchema = new Schema<ILead>({
  formId: { type: String, required: true },
  fullName: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  nationality: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  leadStatus: {
    type: String,
    enum: Object.values(leadStatus),
    default: leadStatus.INITIATED,
  },

  timeToSubmit: { type: Number, required: true },

  additionalInfo: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

export const LeadModel = model<ILead>("Lead", LeadSchema);
