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
    default: null 
  },

  caseId: {
    type: String,
    unique: true,
    // required: true,
  }
}, { timestamps: true });

LeadSchema.pre("save", async function (next) {
  const lead = this as ILead;

  // Only generate caseId if it's a new document
  if (lead.isNew) {
    let caseId;
    let exists = true;

    do {
      // Using dynamic import for nanoid
      const { nanoid } = await import('nanoid');
      const shortId = nanoid(6).toUpperCase(); // e.g., A7C8X9
      const year = new Date().getFullYear();
      caseId = `E360-${year}-${shortId}`;

      const existing = await LeadModel.exists({ caseId });
      exists = existing !== null;
    } while (exists);

    lead.caseId = caseId;
  }

  next();
});

export const LeadModel = model<ILead>("Lead", LeadSchema);