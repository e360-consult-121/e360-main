import mongoose, { Schema, Document } from "mongoose";
import { QuestionTypeEnum, DocumentSourceEnum } from "../types/enums/enums";

export interface IRequirement extends Document {
  type: QuestionTypeEnum;
  question: string;          
  options: string[];          
  required: boolean; 
  source: DocumentSourceEnum;
}

const RequirementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(QuestionTypeEnum),
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  required: {
    type: Boolean,
    default:true,
    required: true,
  },
  source: {
    type: String,
    enum: Object.values(DocumentSourceEnum),
    required: true,
  },
});

export const RequirementModel = mongoose.model<IRequirement>("Requirement", RequirementSchema);
