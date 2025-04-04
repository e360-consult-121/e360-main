import mongoose, { Schema, Document } from "mongoose";
import { StepStatusEnum } from "../types/enums/enums";
import { IRequirementStatus } from "./RequirementStatus";

interface IStepStatus extends Document {
    visaApplicationId: Schema.Types.ObjectId;
    stepNumber: number;
    stepName: string;
    status: StepStatusEnum;
    unlockedAt: Date;
    requirementStatus: IRequirementStatus[];
}

const stepStatus = new mongoose.Schema<IStepStatus>({
    visaApplicationId: {
        type: Schema.Types.ObjectId,
        ref: "VisaApplication",
        required: true,
    },
    stepNumber: {
        type: Number,
        required: true,
    },
    stepName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(StepStatusEnum),
        required: true,
    },
    unlockedAt: {
        type: Date,
        required: true,
    },
    requirementStatus: [
        {
            type: Schema.Types.ObjectId,
            ref: "RequirementStatus",
        },
    ],
});

export const StepStatusModel = mongoose.model<IStepStatus>("StepStatus", stepStatus);
