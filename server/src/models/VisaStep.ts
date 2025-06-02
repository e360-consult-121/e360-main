import mongoose, { Schema, Document } from "mongoose";
import {
  DocumentSourceEnum,
  StepStatusEnum,
  StepTypeEnum,
} from "../types/enums/enums";

export interface EmailTrigger {
  status: StepStatusEnum;
  templateId: string;
  subject:string;
  to: "USER" | "ADMIN";
}

export interface IVisaStep extends Document {
  stepName: string;
  stepNumber: number;
  stepSource: DocumentSourceEnum | null;
  stepType: StepTypeEnum;
  visaTypeId: mongoose.Schema.Types.ObjectId;
  emailTriggers?: EmailTrigger[];
  inProgressMessage?: string;
}

const VisaStepSchema = new Schema<IVisaStep>(
  {
    visaTypeId: {
      type: Schema.Types.ObjectId,
      ref: "VisaType",
      required: true,
    },
    stepName: {
      type: String,
      required: true,
    },
    stepNumber: {
      type: Number,
      required: true,
    },
    stepSource: {
      type: String,
      enum: [...Object.values(DocumentSourceEnum), null],
      default: null,
      required: false,
    },
    stepType: {
      type: String,
      enum: Object.values(StepTypeEnum),
      required: true,
    },
    emailTriggers: {
      type: [
        {
          status: {
            type: String,
            enum: Object.values(StepStatusEnum),
            required: true,
          },
          templateId: {
            type: String,
            required: true,
          },
          to: {
            type: String,
            enum: ["USER", "ADMIN"],
            required: true,
          },
        },
      ],
      required: false,
    },
    inProgressMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const VisaStepModel = mongoose.model<IVisaStep>(
  "VisaStep",
  VisaStepSchema
);
