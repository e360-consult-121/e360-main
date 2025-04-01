import mongoose, { Schema, Document, Mixed } from "mongoose";
import { QuestionStatusEnum } from "../types/enums/enums";
import { IRequirement } from "./Requirement";

export interface IRequirementStatus extends Document {
  requirement: Schema.Types.ObjectId; 
  status: QuestionStatusEnum;         
  reason: string;
  value: Mixed;
}

const RequirementStatusSchema = new Schema<IRequirementStatus>({
  requirement: {
    type: Schema.Types.ObjectId,
    ref: "Requirement",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(QuestionStatusEnum),
    required: true,
  },
  reason: {
    type: String,
    // required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

export const RequirementStatusModel = mongoose.model<IRequirementStatus>("RequirementStatus", RequirementStatusSchema);
