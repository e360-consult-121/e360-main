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

  // timeToSubmit: Date;

  additionalInfo?: Record<string, any>;
  reasonOfRejection?: string | null;

  createdAt?: Date;
  updatedAt?: Date;

  caseId?: string;
  __t?: string; 
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

  additionalInfo: {
    type: Schema.Types.Mixed,
    default: {},
  },

  reasonOfRejection: {
    type: String,
    default : null 
  } , 

  caseId: {
    type: String,
    unique: true,
    // required : true ,
  }

}, { timestamps: true });





LeadSchema.pre("save", async function (next) {
  const lead = this as ILead;

  // Only generate caseId if it's a new document
  if (lead.isNew) {
    const count = await LeadModel.countDocuments();
    const caseNumber = String(count + 1).padStart(4, "0");    // 0001, 0002, etc.
    lead.caseId = `E360-DXB-${caseNumber}`;
  }

  next();
});

export const LeadModel = model<ILead>("Lead", LeadSchema);
